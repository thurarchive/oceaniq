# 📊 Oceaniq Marine Waste Observation Datasets

Welcome to the **Oceaniq Open Marine Waste Dataset** directory. This repository contains verified observation records, station lag metrics, environmental parameters, and synthetic training observations for coastal waste monitoring in Indonesia.

---

## 📜 Dataset Licensing (CC BY 4.0)

Unless otherwise indicated, all verified and published Oceaniq observation datasets and data documentation in this directory are licensed under the **Creative Commons Attribution 4.0 International License ([CC BY 4.0](https://creativecommons.org/licenses/by/4.0/))**.

See full dataset licensing details in [DATA_LICENSE.md](file:///c:/Oceaniq/DATA_LICENSE.md).

---

## 📁 Dataset Scope & Directory Contents

| File / Dataset | Description | License | Storage Status |
| :--- | :--- | :--- | :--- |
| `Data.csv` | Field observation logs with GPS coordinates, waste volume, and category composition. | CC BY 4.0 | Ignored in git (Local/External) |
| `DataCompatible.csv` | Normalized tabular observation dataset formatted for ML model training. | CC BY 4.0 | Ignored in git (Local/External) |
| `Parameter Lingkungan.csv` | Weather, tidal, rainfall, and sea level anomaly parameters per monitoring station. | CC BY 4.0 | Ignored in git (Local/External) |
| `mock_waste_observations.csv` | High-density synthetic observation dataset for XGBoost baseline training. | CC BY 4.0 | Ignored in git (Local/External) |
| `Guide.txt` | Dataset column definitions and measurement unit guide. | CC BY 4.0 | Ignored in git (Local/External) |
| `README.md` | Dataset documentation, baseline citations, and schema details. | CC BY 4.0 | **Tracked in Git** |

> 💡 **Note on Repository Tracking**: Heavy dataset files (`*.csv`, `*.xlsx`, `*.json`) are excluded from Git commits via `.gitignore` (`/dataset/*` with `!/dataset/README.md`) to keep the repository lightweight. Documentation remain fully tracked on GitHub.

---

## 📚 Baseline Dataset & Academic Citations

Oceaniq utilizes public baseline marine debris data and research from Indonesian coastal studies to benchmark ML density forecasts and historical trends.

### Baseline Dataset Citation
> **Purba, Noir; Faizal, Ibnu; Martasuganda, Marine (2021)**, *“Marine Debris Dataset in Coastal Areas in Indonesia”*, Mendeley Data, V2, **DOI**: [10.17632/r3y43cdd3x.2](https://doi.org/10.17632/r3y43cdd3x.2)

### Related Research Articles
- **Marine Pollution Bulletin Article**:  
  [https://doi.org/10.1016/j.marpolbul.2019.05.057](https://doi.org/10.1016/j.marpolbul.2019.05.057)
- **PSJD Research Index Article**:  
  [http://psjd.icm.edu.pl/psjd/element/bwmeta1.element.psjd-af68cd90-e87b-4e8a-8d5c-d6e374463f6d](http://psjd.icm.edu.pl/psjd/element/bwmeta1.element.psjd-af68cd90-e87b-4e8a-8d5c-d6e374463f6d)

---

## 🏷️ Versioning & Citation Format

- **Dataset Version**: `v1.0.0`
- **Geographic Coverage**: Indonesian Coastal Waters & River Mouth Hotspots (Java Sea, Sunda Strait, Jakarta Bay, Bali Coast)
- **Time Horizon**: 2024 – 2026

### Recommended Citation Format
```bibtex
@dataset{oceaniq_2026_dataset,
  author       = {Oceaniq Contributors & Citizen Science Network},
  title        = {Oceaniq Marine Debris & Environmental Observation Dataset},
  year         = 2026,
  publisher    = {Oceaniq Platform},
  version      = {1.0.0},
  url          = {https://github.com/thurarchive/oceaniq},
  note         = {Licensed under CC BY 4.0}
}
```

---

## 🚫 Exclusions & Data Privacy
- **Personal Data**: Contributor email addresses and private user account metadata are omitted to protect privacy.
- **Unverified Reports**: Draft and pending-moderation records are excluded from public dataset releases until verified by expert moderators.
- **Source Code**: Platform software source code is governed separately under the [MIT License](file:///c:/Oceaniq/LICENSE).
