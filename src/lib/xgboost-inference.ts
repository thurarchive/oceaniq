/**
 * Pure TypeScript XGBoost Inference Engine
 *
 * Walks the XGBoost flat-array JSON model tree-by-tree with zero dependencies.
 * Compatible with the XGBoost native JSON format (gbtree booster).
 *
 * Works in any serverless environment — no WASM, no native binaries.
 */

// ─── Types matching the XGBoost flat-array JSON format ───────────────────────

interface XGBFlatTree {
  id: number;
  /** -1 for leaf nodes */
  left_children: number[];
  /** -1 for leaf nodes */
  right_children: number[];
  /** Feature index for each internal node */
  split_indices: number[];
  /** Split threshold for each internal node */
  split_conditions: number[];
  /** 0 = go right on missing, 1 = go left on missing */
  default_left: number[];
  /** Leaf output values (only valid for leaf nodes, but array length == num_nodes) */
  base_weights: number[];
  tree_param: { num_nodes: string };
}

interface XGBModel {
  learner: {
    learner_model_param: {
      base_score: string; // e.g. "[8.327132E2]" or "8.327132E2"
      num_feature: string;
    };
    feature_names: string[];
    gradient_booster: {
      model: {
        trees: XGBFlatTree[];
        gbtree_model_param: { num_trees: number | string };
      };
    };
  };
}

// ─── Parse base_score from format "[8.327132E2]" or "8.327132E2" ─────────────

function parseBaseScore(raw: string): number {
  const cleaned = raw.replace(/^\[/, '').replace(/\]$/, '');
  return parseFloat(cleaned);
}

// ─── Traverse one flat tree ───────────────────────────────────────────────────

function traverseFlatTree(tree: XGBFlatTree, features: number[]): number {
  let nodeIdx = 0;

  while (true) {
    const leftChild = tree.left_children[nodeIdx];

    // Leaf node: left_children[i] === -1
    if (leftChild === -1) {
      return tree.base_weights[nodeIdx];
    }

    const featureIdx = tree.split_indices[nodeIdx];
    const threshold = tree.split_conditions[nodeIdx];
    const featureValue = features[featureIdx];

    if (featureValue === undefined || isNaN(featureValue)) {
      // Missing value → use default direction
      nodeIdx = tree.default_left[nodeIdx] === 1
        ? tree.left_children[nodeIdx]
        : tree.right_children[nodeIdx];
    } else if (featureValue < threshold) {
      nodeIdx = tree.left_children[nodeIdx];
    } else {
      nodeIdx = tree.right_children[nodeIdx];
    }
  }
}

// ─── Main inference function ──────────────────────────────────────────────────

/**
 * Run XGBoost inference on a single input row.
 *
 * @param model   Parsed XGBoost JSON model object
 * @param input   Key→value map of feature name → numeric value
 * @returns       Raw prediction (base_score + sum of tree outputs)
 */
export function xgboostPredict(
  model: XGBModel,
  input: Record<string, number>
): number {
  const featureNames: string[] = model.learner.feature_names;

  // Build ordered feature array from input dict
  const features: number[] = featureNames.map((name) => {
    const v = input[name];
    return v !== undefined ? v : NaN;
  });

  const baseScore = parseBaseScore(model.learner.learner_model_param.base_score);
  const trees = model.learner.gradient_booster.model.trees;

  let prediction = baseScore;
  for (const tree of trees) {
    prediction += traverseFlatTree(tree, features);
  }

  return prediction;
}

// ─── Model loading with in-memory cache ──────────────────────────────────────

let cachedModel: XGBModel | null = null;

/**
 * Load & cache the XGBoost model JSON.
 * The cache persists across warm serverless invocations (~10x speedup).
 */
export async function loadXGBoostModel(): Promise<XGBModel> {
  if (cachedModel) return cachedModel;

  // Dynamic import — Next.js bundles JSON from src/ correctly at build time
  const mod = await import('@/data/xgboost_tuned_model.json');
  cachedModel = mod.default as unknown as XGBModel;
  return cachedModel;
}
