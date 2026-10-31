"""Build the public, two-page portfolio resume (requires reportlab).

Content is curated from the existing portfolio and the owner's supplied CV.
No new metrics or certifications are introduced.
"""
from pathlib import Path
from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.pagesizes import A4
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, KeepTogether

ROOT = Path(__file__).resolve().parent.parent
OUTPUT = ROOT / 'assets' / 'Bhanu_Manideep_Vejendla_Resume.pdf'
FONT_ROOT = Path('/usr/share/fonts/truetype/dejavu')
for name, filename in [('Resume', 'DejaVuSans.ttf'), ('Resume-Bold', 'DejaVuSans-Bold.ttf')]:
    pdfmetrics.registerFont(TTFont(name, str(FONT_ROOT / filename)))
pdfmetrics.registerFontFamily('Resume', normal='Resume', bold='Resume-Bold')

NAVY = colors.HexColor('#172033')
BLUE = colors.HexColor('#315fce')
MUTED = colors.HexColor('#46546b')
BODY = ParagraphStyle('Body', fontName='Resume', fontSize=9.3, leading=13.8, textColor=NAVY, spaceAfter=6)
SMALL = ParagraphStyle('Small', parent=BODY, fontSize=8.5, leading=12, textColor=MUTED)
SECTION = ParagraphStyle('Section', parent=BODY, fontName='Resume-Bold', fontSize=10, leading=14, textColor=BLUE, spaceBefore=13, spaceAfter=7, keepWithNext=True)
ROLE = ParagraphStyle('Role', parent=BODY, fontName='Resume-Bold', fontSize=10.5, leading=15, spaceAfter=2, keepWithNext=True)
BULLET = ParagraphStyle('Bullet', parent=BODY, leftIndent=11, firstLineIndent=-9, spaceAfter=5)
story = []

def p(text, style=BODY):
    story.append(Paragraph(text, style))

def section(title):
    p(title.upper(), SECTION)

def role(title, company, location, dates, bullets):
    story.append(KeepTogether([
        Paragraph(f'{title} | {company}', ROLE),
        Paragraph(f'{location}  |  {dates}', SMALL),
        Spacer(1, 4),
        Paragraph('- ' + bullets[0], BULLET),
    ]))
    for text in bullets[1:]:
        p('- ' + text, BULLET)
    story.append(Spacer(1, 5))

def footer(canvas, doc):
    canvas.saveState()
    width, height = A4
    canvas.setStrokeColor(colors.HexColor('#d7deea'))
    canvas.line(42, 36, width-42, 36)
    canvas.setFont('Resume', 7.5)
    canvas.setFillColor(MUTED)
    canvas.drawString(42, 23, 'BHANU MANIDEEP VEJENDLA | SENIOR DATA ENGINEER')
    canvas.drawRightString(width-42, 23, f'{doc.page} / 2')
    canvas.restoreState()

p('Bhanu Manideep Vejendla', ParagraphStyle('Name', parent=BODY, fontName='Resume-Bold', fontSize=23, leading=29, spaceAfter=3))
p('SENIOR DATA ENGINEER', ParagraphStyle('Title', parent=BODY, fontName='Resume-Bold', fontSize=11, leading=16, textColor=BLUE, spaceAfter=8))
p('Raleigh, NC, USA | <link href="mailto:bhanumanideepvejendla@gmail.com">bhanumanideepvejendla@gmail.com</link>', SMALL)
p('<link href="https://bhanuvejendla.com">bhanuvejendla.com</link> | <link href="https://www.linkedin.com/in/vejendlabhanu">linkedin.com/in/vejendlabhanu</link> | <link href="https://github.com/Bhanu047">github.com/Bhanu047</link>', SMALL)

section('Professional summary')
p('Senior Data Engineer with 7+ years of experience building batch and streaming data platforms across Azure, AWS and GCP. Experience spans insurance, gaming, financial services and healthcare. Focused on reliable pipelines, reusable Python frameworks, data modelling, quality checks, failure recovery, secure access, and production performance and cost.')

section('Technical skills')
for label, text in [
    ('Languages', 'SQL, Python, PySpark, Scala, Java, Bash'),
    ('Processing and streaming', 'Apache Spark, Databricks, Spark Structured Streaming, Kafka, Apache Beam'),
    ('Orchestration', 'Azure Data Factory, Airflow, AWS Glue; CDC, deduplication, incremental loading'),
    ('Storage and analytics', 'Snowflake, Synapse, Redshift, BigQuery, ADLS Gen2, S3, Delta Lake, dbt'),
    ('Delivery and operations', 'Terraform, Docker, Kubernetes, Git, Jenkins; validation, monitoring and access controls'),
]:
    p(f'<b>{label}:</b> {text}', SMALL)

section('Professional experience')
role('Azure Data Engineer', 'MetLife', 'Cary, North Carolina, USA', 'Apr 2024 - Present', [
    'Build Azure Data Factory pipelines moving data from Blob Storage and ADLS Gen2 through Databricks into Synapse and Azure SQL for operational reporting.',
    'Designed a reusable Python ETL framework for Synapse integration, CDC, deduplication and high-watermark incremental loading, standardising development across teams.',
    'Built real-time weblog pipelines through Kafka and Spark Streaming with data-quality checks and business transformations.',
    'Own dataset SLAs and freshness targets, monitor daily loads and triage pipeline failures with platform teams.',
    'Implement masking and role-based access for sensitive customer data; mentor engineers and review framework contributions.',
])
role('AWS Data Engineer', 'Epic Games', 'Cary, North Carolina, USA', 'May 2023 - Mar 2024', [
    'Designed AWS Glue ETL workflows to move campaign data from S3 into Redshift, processing ORC, Parquet and text inputs.',
    'Built Spark jobs for XML, CSV and JSON, with metadata validation, reconciliation and error handling.',
    'Automated AWS infrastructure with Terraform, reducing infrastructure management time by 90% and improving uptime.',
    'Tuned Snowflake queries and developed Elasticsearch/Kibana monitoring for near-real-time transaction visibility.',
])

story.append(PageBreak())
p('Bhanu Manideep Vejendla', ParagraphStyle('Continuation', parent=ROLE, fontSize=15, leading=21, spaceAfter=4))
p('Senior Data Engineer | Experience, selected projects and education', SMALL)
section('Professional experience - continued')
role('GCP Data Engineer', 'InCred Finance', 'Mumbai, India', 'Nov 2020 - Nov 2022', [
    'Built Airflow ETL pipelines on GCP, loading curated data into BigQuery.',
    'Developed Databricks notebooks in PySpark and Spark SQL to extract, analyse and model data against business requirements.',
    'Processed data using Dataproc, Cloud Storage, BigQuery and Cloud Functions; monitored jobs with Stackdriver.',
    'Created Data Studio reports on service billing and usage to support query optimisation and cost-saving measures.',
])
role('Data Engineer', 'Siemens Healthineers', 'Mumbai, India', 'Oct 2018 - Oct 2020', [
    'Developed ETL pipelines between data warehouses with Python, Snowflake and SnowSQL.',
    'Integrated Kafka with Spark Streaming and provisioned Databricks clusters for batch and streaming workloads.',
    'Implemented data validation, anomaly detection and profiling; designed Hive tables with partitioning and bucketing.',
    'Scheduled pipelines with Airflow and Azure Data Factory, and automated delivery using Terraform, Git, Jenkins, Python and Bash.',
])

section('Selected engineering projects')
for title, url, text in [
    ('Weblog Stream', 'https://github.com/Bhanu047/weblog-stream', 'Kafka, PySpark and Delta Lake pipeline with schema validation, a dead-letter path, event-time watermarks and checkpoint recovery.'),
    ('NYC Taxi Lakehouse', 'https://github.com/Bhanu047/nyc-taxi-lakehouse', 'PySpark batch lakehouse with declared schemas, bronze/silver/gold layers, manifest-driven loading and a documented backfill path.'),
    ('Retail Warehouse', 'https://github.com/Bhanu047/retail-warehouse', 'SQL, dbt and DuckDB warehouse with staging and mart layers, incremental loading, revenue reconciliation and historical dimensions.'),
    ('Data Platform Terraform', 'https://github.com/Bhanu047/data-platform-terraform', 'Reusable AWS S3, Glue and IAM modules with separate environment inputs, least-privilege access and plan-time checks.'),
    ('Kingdom846', 'https://kingdom846.com', 'Live community platform built with React, Express and SQLite, including role-based access and version-aware writes.'),
]:
    p(f'<b><link href="{url}" color="#315fce">{title}</link></b> - {text}', SMALL)

section('Education')
p('<b>MSc Information Systems (Data Management)</b>', BODY)
p('Dakota State University, Madison, South Dakota, USA | Jan 2023 - May 2024', SMALL)
p('GPA: 3.91 / 4.0', SMALL)

doc = SimpleDocTemplate(str(OUTPUT), pagesize=A4, rightMargin=42, leftMargin=42, topMargin=36, bottomMargin=49,
                        title='Bhanu Manideep Vejendla - Senior Data Engineer Resume', author='Bhanu Manideep Vejendla')
doc.build(story, onFirstPage=footer, onLaterPages=footer)
print(OUTPUT)
