// Technologies as reusable entities
export interface Technology {
  id: string;
  name: string;
  color: string;
}

export interface Project {
  id: string;
  title: string;
  image: string;
  technologies: string[]; // Array of technology IDs
  businessVision: {
    problem: string;
    decision: string;
    impact: string;
  };
  technicalDetail: {
    architecture: string;
    stack: string;
    dataFlow: string;
  };
  githubUrl: string;
}

// Normalized technologies
export const technologies: Technology[] = [
  { id: "python", name: "Python", color: "#3776AB" },
  { id: "pandas", name: "Pandas", color: "#2C5D8A" },
  { id: "numpy", name: "NumPy", color: "#4A90E2" },
  { id: "scipy", name: "SciPy", color: "#8CAAE6" },
  { id: "matplotlib", name: "Matplotlib", color: "#11557C" },
  { id: "seaborn", name: "Seaborn", color: "#3775AD" },
  { id: "plotly", name: "Plotly", color: "#3F4F75" },
  { id: "sql", name: "SQL", color: "#00758F" },
  { id: "postgresql", name: "PostgreSQL", color: "#336791" },
  { id: "sqlserver", name: "SQL Server", color: "#A91D22" },
  { id: "mysql", name: "MySQL", color: "#00618A" },
  { id: "snowflake", name: "Snowflake", color: "#29B5E8" },
  { id: "bigquery", name: "BigQuery", color: "#4285F4" },
  { id: "powerbi", name: "Power BI", color: "#E8B600" },
  { id: "excel", name: "Excel", color: "#217346" },
  { id: "tableau", name: "Tableau", color: "#E97627" },
  { id: "powerpoint", name: "PowerPoint", color: "#B7472A" },
  { id: "pdf", name: "PDF", color: "#E91E63" },
  { id: "scikit", name: "Scikit-learn", color: "#F7931E" },
  { id: "xgboost", name: "XGBoost", color: "#8A2BE2" },
  { id: "airflow", name: "Apache Airflow", color: "#017CEE" },
  { id: "spark", name: "Apache Spark", color: "#E25A1C" },
  { id: "aws", name: "AWS", color: "#FF9900" },
  { id: "azure", name: "Azure", color: "#0078D4" },
  { id: "github", name: "Github", color: "#4078C0" },
  { id: "docker", name: "Docker", color: "#2496ED" },
];

// Projects data
export const projects: Project[] = [
  {
    id: "sales-forecasting",
    title: "Sales Forecasting Pipeline",
    image: "/images/sales-forecasting.jpg",
    technologies: ["python", "pandas", "scikit", "powerbi", "sql"],
    businessVision: {
      problem:
        "Regional managers were making inventory decisions based on intuition, leading to 23% overstock in Q4 and frequent stockouts during peak periods.",
      decision:
        "Implemented ML-driven demand forecasting to enable data-backed inventory allocation across 45 distribution centers.",
      impact:
        "Reduced overstock costs by $2.4M annually and improved product availability by 18%, directly impacting customer satisfaction scores.",
    },
    technicalDetail: {
      architecture:
        "Batch processing pipeline with daily model retraining. Feature store for historical sales patterns, seasonal adjustments, and promotional calendars.",
      stack:
        "Python (Pandas, Scikit-learn) for ML pipeline, SQL Server for data warehouse, Power BI for executive dashboards.",
      dataFlow:
        "POS data → ETL processing → Feature engineering → Model training → Predictions → Power BI reports → Automated alerts.",
    },
    githubUrl: "https://github.com/example/sales-forecasting",
  },
  {
    id: "customer-segmentation",
    title: "Customer Segmentation Engine",
    image: "/images/customer-segmentation.jpg",
    technologies: ["python", "bigquery", "looker", "scikit", "airflow"],
    businessVision: {
      problem:
        "Marketing campaigns had a 2.3% conversion rate with one-size-fits-all messaging, wasting 40% of the digital ad budget.",
      decision:
        "Created dynamic customer segments based on behavioral patterns to enable personalized marketing at scale.",
      impact:
        "Increased conversion rates to 7.8% and reduced cost per acquisition by 34%, generating $1.2M in incremental revenue.",
    },
    technicalDetail: {
      architecture:
        "Real-time segmentation engine with daily batch updates. RFM analysis combined with behavioral clustering.",
      stack:
        "BigQuery for data warehouse, Python for ML models, Airflow for orchestration, Looker for self-service analytics.",
      dataFlow:
        "Customer interactions → BigQuery → Python clustering → Segment assignment → Marketing automation → Looker dashboards.",
    },
    githubUrl: "https://github.com/example/customer-segmentation",
  },
  {
    id: "supply-chain-analytics",
    title: "Supply Chain Analytics Platform",
    image: "/images/supply-chain.jpg",
    technologies: ["spark", "snowflake", "tableau", "python", "aws"],
    businessVision: {
      problem:
        "Supply chain visibility was fragmented across 12 systems, making it impossible to identify bottlenecks until they caused production delays.",
      decision:
        "Built a unified analytics platform providing end-to-end supply chain visibility with predictive alerting.",
      impact:
        "Reduced lead time variability by 40% and prevented $3.8M in potential production delays through early warning systems.",
    },
    technicalDetail: {
      architecture:
        "Lambda architecture combining real-time streaming with batch processing for comprehensive supply chain metrics.",
      stack:
        "Apache Spark for data processing, Snowflake for analytics warehouse, Tableau for visualization, AWS for infrastructure.",
      dataFlow:
        "Supplier data + Logistics APIs + ERP → Spark processing → Snowflake → Tableau dashboards → Slack alerts.",
    },
    githubUrl: "https://github.com/example/supply-chain-analytics",
  },
  {
    id: "financial-reporting",
    title: "Automated Financial Reporting",
    image: "/images/financial-reporting.jpg",
    technologies: ["python", "sql", "powerbi", "excel", "azure"],
    businessVision: {
      problem:
        "Monthly financial close took 15 business days with 3 FTEs dedicated to manual report compilation and reconciliation.",
      decision:
        "Automated the entire financial reporting pipeline from data extraction to executive presentation generation.",
      impact:
        "Reduced close cycle to 5 days, freed 2 FTEs for strategic analysis, and eliminated 95% of manual data entry errors.",
    },
    technicalDetail: {
      architecture:
        "Event-driven automation with scheduled jobs and exception-based human intervention points.",
      stack:
        "Python for automation scripts, Azure SQL for data storage, Power BI for reports, Excel integration for legacy compatibility.",
      dataFlow:
        "ERP systems → Python extraction → Azure SQL → Automated reconciliation → Power BI reports → Email distribution.",
    },
    githubUrl: "https://github.com/example/financial-reporting",
  },
  {
    id: "churn-prediction",
    title: "Customer Churn Prediction Model",
    image: "/images/churn-prediction.jpg",
    technologies: ["python", "pandas", "scikit", "dbt", "snowflake"],
    businessVision: {
      problem:
        "Customer retention team was reactive, only addressing churn after customers had already decided to leave, with 18% annual churn rate.",
      decision:
        "Developed predictive churn model to identify at-risk customers 60 days before likely cancellation.",
      impact:
        "Enabled proactive retention campaigns that reduced churn by 5.2 percentage points, saving $4.1M in annual recurring revenue.",
    },
    technicalDetail: {
      architecture:
        "Feature-rich ML pipeline with automated retraining and model monitoring. A/B testing framework for retention strategies.",
      stack:
        "Python for ML, dbt for data transformations, Snowflake for data warehouse, custom dashboard for retention team.",
      dataFlow:
        "Product usage data → dbt transformations → Feature engineering → Churn predictions → CRM integration → Action queues.",
    },
    githubUrl: "https://github.com/example/churn-prediction",
  },
  {
    id: "marketing-attribution",
    title: "Multi-Touch Marketing Attribution",
    image: "/images/marketing-attribution.jpg",
    technologies: ["bigquery", "python", "looker", "airflow", "dbt"],
    businessVision: {
      problem:
        "Last-click attribution was misallocating $2M in marketing spend, over-crediting paid search while undervaluing brand awareness channels.",
      decision:
        "Implemented data-driven multi-touch attribution model to accurately measure channel contribution across the customer journey.",
      impact:
        "Optimized marketing mix allocation, increasing ROAS by 28% and identifying $800K in spend to reallocate to higher-performing channels.",
    },
    technicalDetail: {
      architecture:
        "Markov chain attribution model with position-based weighting. Full customer journey reconstruction across devices.",
      stack:
        "BigQuery for event storage, Python for attribution modeling, dbt for transformations, Looker for reporting, Airflow for orchestration.",
      dataFlow:
        "Touchpoint events → Identity resolution → Journey mapping → Attribution calculation → Channel performance dashboards.",
    },
    githubUrl: "https://github.com/example/marketing-attribution",
  },
];

// Helper function to get technology by ID
export function getTechnologyById(id: string): Technology | undefined {
  return technologies.find((tech) => tech.id === id);
}

// Helper function to get technologies for a project
export function getProjectTechnologies(project: Project): Technology[] {
  return project.technologies
    .map((id) => getTechnologyById(id))
    .filter((tech): tech is Technology => tech !== undefined);
}
