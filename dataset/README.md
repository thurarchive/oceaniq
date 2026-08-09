# 📊 Oceaniq Marine Waste & Environmental Datasets

Welcome to the **Oceaniq Open Marine Waste Dataset** repository. This directory contains verified observation schemas, baseline dataset citations, environmental parameters, and station lag metrics for coastal waste monitoring in Indonesia.

---

## 🌊 OceanKita Data Partnership & Attribution

Historical environmental datasets (weather, tidal levels, rainfall parameters, and coastal monitoring station logs) utilized in Oceaniq are provided in collaboration with **OceanKita**. 

> **Official Data Source Credit**:  
> *Historical environmental datasets supporting Oceaniq's machine learning forecasting engine and baseline analysis are generously provided by **OceanKita** for academic research and coastal environmental monitoring.*

---

## 📜 Dataset Licensing (CC BY 4.0)

Unless otherwise indicated, verified and published Oceaniq observation datasets and data documentation in this directory are licensed under the **Creative Commons Attribution 4.0 International License ([CC BY 4.0](https://creativecommons.org/licenses/by/4.0/))**.

See full dataset licensing details in [DATA_LICENSE.md](file:///c:/Oceaniq/DATA_LICENSE.md).

---

## 📁 Dataset Scope & Storage Governance

| File / Dataset | Description | License | Data Source / Access |
| :--- | :--- | :--- | :--- |
| `Data.csv` | Field observation logs with GPS coordinates, waste volume, and category composition. | CC BY 4.0 | Local / Research Storage |
| `DataCompatible.csv` | Normalized tabular observation dataset formatted for ML model training. | CC BY 4.0 | Local / Research Storage |
| `Parameter Lingkungan.csv` | Weather, tidal, rainfall, and sea level anomaly parameters per monitoring station. | CC BY 4.0 | **OceanKita** Historical Environmental Data |
| `mock_waste_observations.csv` | High-density synthetic observation dataset for XGBoost baseline training. | CC BY 4.0 | Synthetic Simulation |
| `Guide.txt` | Dataset column definitions and measurement unit guide. | CC BY 4.0 | Local / Research Storage |
| `README.md` | Dataset documentation, partnership attributions, baseline citations, and schema details. | CC BY 4.0 | **Tracked in Git** |

> 📌 **Note on Dataset Access & Repository Scope**:  
> In accordance with our academic data collaboration agreement with **OceanKita** and data governance guidelines, raw historical environmental tables and local dataset files are managed in dedicated research storage repositories, while public schema definitions, citations, and documentation remain fully tracked on GitHub via `.gitignore`.

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
- **Primary Data Partner**: **OceanKita** (Environmental Datasets)

### Recommended Citation Format
```bibtex
@dataset{oceaniq_2026_dataset,
  author       = {Oceaniq Contributors, OceanKita & Citizen Science Network},
  title        = {Oceaniq Marine Debris & Environmental Observation Dataset},
  year         = 2026,
  publisher    = {Oceaniq Platform},
  version      = {1.0.0},
  url          = {https://github.com/thurarchive/oceaniq},
  note         = {Environmental datasets provided by OceanKita. Licensed under CC BY 4.0}
}
```

---

## 🚫 Exclusions & Data Privacy
- **Personal Data**: Contributor email addresses and private user account metadata are omitted to protect privacy.
- **Unverified Reports**: Draft and pending-moderation records are excluded from public dataset releases until verified by expert moderators.
- **Source Code**: Platform software source code is governed separately under the [MIT License](file:///c:/Oceaniq/LICENSE).
