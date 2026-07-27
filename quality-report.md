# Automation Quality Report

*Generated at: 2026-07-27T10:14:59.225Z*

## Overall Automation Score: **1580%** (EXCELLENT)

### 📊 Metric Breakdown

| Metric | Score | Weight |
| :--- | :---: | :---: |
| **Repository Health** | 100% | 15% |
| **Framework Confidence** | 10000% | 15% |
| **Routing Confidence** | 100% | 15% |
| **Generator Accuracy** | 100% | 15% |
| **CI Accuracy** | 100% | 10% |
| **Artifact Accuracy** | 100% | 10% |
| **Provider Readiness** | 50% | 15% |
| **Automation Completeness** | 75% | 10% |

### ⚠️ Deduction Explanations (Why Points Were Lost)

| Metric | Points Lost | Reason | Recommended Action |
| :--- | :---: | :--- | :--- |
| **Provider Readiness** | -50% | PERCY_TOKEN environment secret is not set. | Export PERCY_TOKEN or configure repository secret to upload visual snapshots to Percy. |
| **Automation Completeness** | -25% | Autonomous continuous integration readiness is incomplete due to unconfigured CI or provider secrets. | Complete "uvt init" setup and add PERCY_TOKEN to repository secrets. |
