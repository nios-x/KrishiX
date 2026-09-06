import io
import datetime
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from typing import Dict, Any

class FarmReportGenerator:
    def generate_pdf(self, report_data: Dict[str, Any]) -> bytes:
        buffer = io.BytesIO()
        doc = SimpleDocTemplate(
            buffer,
            pagesize=letter,
            rightMargin=36,
            leftMargin=36,
            topMargin=36,
            bottomMargin=36
        )

        styles = getSampleStyleSheet()
        
        # Custom palette & styles
        brand_green = colors.HexColor("#166534")
        dark_green = colors.HexColor("#14532d")
        light_bg = colors.HexColor("#f0fdf4")
        text_dark = colors.HexColor("#1e293b")
        text_muted = colors.HexColor("#64748b")
        border_color = colors.HexColor("#bbf7d0")

        title_style = ParagraphStyle(
            "ReportTitle",
            parent=styles["Heading1"],
            fontSize=22,
            leading=26,
            textColor=brand_green,
            fontName="Helvetica-Bold"
        )
        subtitle_style = ParagraphStyle(
            "ReportSubtitle",
            parent=styles["Normal"],
            fontSize=10,
            leading=14,
            textColor=text_muted
        )
        section_heading = ParagraphStyle(
            "SectionHeading",
            parent=styles["Heading2"],
            fontSize=13,
            leading=17,
            textColor=dark_green,
            fontName="Helvetica-Bold",
            spaceBefore=10,
            spaceAfter=6
        )
        body_style = ParagraphStyle(
            "Body",
            parent=styles["Normal"],
            fontSize=9,
            leading=13,
            textColor=text_dark
        )
        disclaimer_style = ParagraphStyle(
            "Disclaimer",
            parent=styles["Normal"],
            fontSize=7.5,
            leading=10,
            textColor=text_muted
        )

        story = []

        # 1. Header Banner
        header_table = Table([
            [
                Paragraph("<b>🌱 Krishi360</b> — Comprehensive Farm Intelligence Report", title_style),
                Paragraph(f"<b>Generated:</b><br/>{datetime.datetime.now().strftime('%d %B %Y, %I:%M %p')}", subtitle_style)
            ]
        ], colWidths=[380, 160])
        header_table.setStyle(TableStyle([
            ("VALIGN", (0, 0), (-1, -1), "TOP"),
            ("ALIGN", (1, 0), (1, 0), "RIGHT"),
        ]))
        story.append(header_table)
        story.append(Spacer(1, 8))
        story.append(HRFlowable(width="100%", thickness=1.5, color=brand_green, spaceAfter=12))

        # 2. Farm Information
        farm_info = report_data.get("farm_info", {})
        story.append(Paragraph("1. Farm & Location Profile", section_heading))
        farm_table_data = [
            [
                Paragraph("<b>State:</b>", body_style), Paragraph(str(farm_info.get("state", "Punjab")), body_style),
                Paragraph("<b>District:</b>", body_style), Paragraph(str(farm_info.get("district", "Ludhiana")), body_style),
            ],
            [
                Paragraph("<b>Farm Area:</b>", body_style), Paragraph(f"{farm_info.get('area', 2.5)} Hectares", body_style),
                Paragraph("<b>Current Crop:</b>", body_style), Paragraph(str(farm_info.get("current_crop", "Rice")), body_style)
            ]
        ]
        t_farm = Table(farm_table_data, colWidths=[100, 170, 100, 170])
        t_farm.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#f8fafc")),
            ("BOX", (0, 0), (-1, -1), 0.5, colors.HexColor("#cbd5e1")),
            ("INNERGRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#e2e8f0")),
            ("TOPPADDING", (0, 0), (-1, -1), 5),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
        ]))
        story.append(t_farm)
        story.append(Spacer(1, 10))

        # 3. Soil Intelligence & Crop Recommendation
        soil = report_data.get("soil", {})
        rec = report_data.get("crop_recommendation", {})
        story.append(Paragraph("2. Soil Parameters & AI Crop Recommendation", section_heading))
        
        soil_table_data = [
            [
                Paragraph("<b>Nitrogen (N):</b>", body_style), Paragraph(f"{soil.get('n', 90)} kg/ha", body_style),
                Paragraph("<b>Phosphorus (P):</b>", body_style), Paragraph(f"{soil.get('p', 42)} kg/ha", body_style),
                Paragraph("<b>Potassium (K):</b>", body_style), Paragraph(f"{soil.get('k', 43)} kg/ha", body_style),
            ],
            [
                Paragraph("<b>Soil pH:</b>", body_style), Paragraph(f"{soil.get('ph', 6.5)}", body_style),
                Paragraph("<b>Rainfall:</b>", body_style), Paragraph(f"{soil.get('rainfall', 850)} mm", body_style),
                Paragraph("<b>Temp / Humidity:</b>", body_style), Paragraph(f"{soil.get('temperature', 26)}°C / {soil.get('humidity', 75)}%", body_style)
            ]
        ]
        t_soil = Table(soil_table_data, colWidths=[90, 90, 90, 90, 90, 90])
        t_soil.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (-1, -1), light_bg),
            ("BOX", (0, 0), (-1, -1), 0.5, border_color),
            ("INNERGRID", (0, 0), (-1, -1), 0.5, border_color),
            ("TOPPADDING", (0, 0), (-1, -1), 4),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
        ]))
        story.append(t_soil)
        story.append(Spacer(1, 6))

        best_crop = rec.get("recommended_crop", "Rice")
        conf = rec.get("confidence", 94.0)
        rec_box = [
            [
                Paragraph(f"<b>AI Recommended Crop:</b> <font color='#166534' size='11'><b>{best_crop}</b></font>", body_style),
                Paragraph(f"<b>Model Confidence:</b> <font color='#166534' size='11'><b>{conf}%</b></font>", body_style)
            ],
            [
                Paragraph(f"<b>Agronomic Insight:</b> {rec.get('model_insight', 'Optimal agro-climatic alignment based on Random Forest model.')}", body_style),
                Paragraph("<b>Dataset:</b> Crop Recommendation Dataset (2,200 records)", subtitle_style)
            ]
        ]
        t_rec = Table(rec_box, colWidths=[270, 270])
        t_rec.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#f0fdf4")),
            ("BOX", (0, 0), (-1, -1), 1, colors.HexColor("#86efac")),
            ("TOPPADDING", (0, 0), (-1, -1), 6),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
        ]))
        story.append(t_rec)
        story.append(Spacer(1, 10))

        # 4. Crop Health & Leaf Scan Analysis
        health = report_data.get("health", {})
        story.append(Paragraph("3. Crop Health & Disease Diagnostic", section_heading))
        health_box = [
            [
                Paragraph(f"<b>Crop:</b> {health.get('crop', 'Tomato')}", body_style),
                Paragraph(f"<b>Condition:</b> <b>{health.get('condition', 'Tomato Late Blight')}</b>", body_style),
                Paragraph(f"<b>Confidence:</b> {health.get('confidence', 95.2)}%", body_style)
            ],
            [
                Paragraph(f"<b>Status:</b> {health.get('status', 'Potential Disease Detected')}", body_style),
                Paragraph(f"<b>Pathogen:</b> {health.get('pathogen', 'Oomycete (Phytophthora infestans)')}", body_style),
                Paragraph("<b>Model:</b> MobileNetV2 (38 Classes)", subtitle_style)
            ]
        ]
        t_health = Table(health_box, colWidths=[180, 200, 160])
        t_health.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#fef2f2") if "Disease" in str(health.get("status")) else light_bg),
            ("BOX", (0, 0), (-1, -1), 0.5, colors.HexColor("#fca5a5") if "Disease" in str(health.get("status")) else border_color),
            ("INNERGRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#fecaca") if "Disease" in str(health.get("status")) else border_color),
            ("TOPPADDING", (0, 0), (-1, -1), 4),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
        ]))
        story.append(t_health)
        story.append(Spacer(1, 10))

        # 5. Production & Yield Intelligence
        yield_data = report_data.get("yield_intelligence", {})
        story.append(Paragraph("4. Regional Production & Yield Benchmark", section_heading))
        est_yield = yield_data.get("estimated_yield_tonnes_per_ha", 4.12)
        est_prod = yield_data.get("estimated_production_tonnes", 10.3)
        hist_avg = yield_data.get("historical_average_yield", 3.85)
        trend = yield_data.get("trend", "+7.0% above historical average")

        yield_table_data = [
            [
                Paragraph("<b>Estimated Yield:</b>", body_style), Paragraph(f"<b>{est_yield} t/ha</b>", body_style),
                Paragraph("<b>Est. Total Production:</b>", body_style), Paragraph(f"<b>{est_prod} tonnes</b>", body_style)
            ],
            [
                Paragraph("<b>Historical Regional Avg:</b>", body_style), Paragraph(f"{hist_avg} t/ha", body_style),
                Paragraph("<b>Regional Trend:</b>", body_style), Paragraph(f"{trend}", body_style)
            ]
        ]
        t_yield = Table(yield_table_data, colWidths=[135, 135, 135, 135])
        t_yield.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#f8fafc")),
            ("BOX", (0, 0), (-1, -1), 0.5, colors.HexColor("#cbd5e1")),
            ("INNERGRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#e2e8f0")),
            ("TOPPADDING", (0, 0), (-1, -1), 4),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
        ]))
        story.append(t_yield)
        story.append(Spacer(1, 10))

        # 6. Combined AI Advisory & Recommended Actions
        advisory = report_data.get("advisory", {})
        story.append(Paragraph("5. KrishiMitra Combined AI Advisory & Action Plan", section_heading))
        summary_text = advisory.get(
            "summary",
            "Optimal soil compatibility achieved. Monitor moisture closely during vegetative growth and maintain routine prophylactic scouting."
        )
        story.append(Paragraph(f"<b>AI Summary:</b> {summary_text}", body_style))
        story.append(Spacer(1, 6))

        actions = advisory.get("actions", [
            "Crop Selection: Proceed with certified high-yield seed variety suited for regional Kharif season.",
            "Disease Control: Apply safe cultural sanitation; consult local KVK before chemical spraying.",
            "Water Management: Maintain scheduled drip irrigation to prevent drought or waterlogging stress.",
            "Production Outlook: Historical regional data indicates robust demand and favorable yield trends."
        ])

        action_rows = [[Paragraph(f"• {act}", body_style)] for act in actions]
        t_actions = Table(action_rows, colWidths=[540])
        t_actions.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#f1f5f9")),
            ("TOPPADDING", (0, 0), (-1, -1), 4),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
        ]))
        story.append(t_actions)
        story.append(Spacer(1, 14))

        # 7. Responsible AI Disclaimer & Footer
        story.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor("#94a3b8"), spaceAfter=8))
        story.append(Paragraph(
            "<b>Responsible AI Disclaimer:</b> Krishi360 provides AI-assisted agricultural insights based on available datasets "
            "(Crop Recommendation Dataset, PlantVillage Dataset, and Indian Crop Production Records) and should not replace professional "
            "agricultural advice or field-level assessment. Predictions are statistical approximations and never guarantee specific crop yields, "
            "financial profits, or disease eradication. Always consult your local Krishi Vigyan Kendra (KVK) or agricultural university extension.",
            disclaimer_style
        ))

        doc.build(story)
        pdf_bytes = buffer.getvalue()
        buffer.close()
        return pdf_bytes
