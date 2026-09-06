import os
import re
from typing import Dict, Any, List, Optional

class KrishiMitraAdvisor:
    def __init__(self, crop_service, health_service, production_service, yield_service):
        self.crop_service = crop_service
        self.health_service = health_service
        self.production_service = production_service
        self.yield_service = yield_service
        self.api_key = os.environ.get("GEMINI_API_KEY", "")

    def chat(self, message: str, context: Optional[Dict[str, Any]] = None, language: str = "en") -> Dict[str, Any]:
        """
        Grounded Agricultural Advisory integrating Crop Recommendation, 
        Plant Disease analysis, and Historical Production trends.
        """
        text = (message or "").strip()
        lower_msg = text.lower()
        context = context or {}

        # Safely extract farmer context elements
        soil = context.get("soil") or {}
        latest_rec = context.get("latest_recommendation") or {}
        latest_health = context.get("latest_health") or {}
        location = context.get("location") or {}
        state = location.get("state") or "Punjab"
        district = location.get("district") or "Ludhiana"
        current_crop = context.get("current_crop") or ""

        # Try Gemini API if key exists
        if self.api_key:
            try:
                from google import genai
                client = genai.Client(api_key=self.api_key)
                
                system_instruction = (
                    "You are KrishiMitra AI, an intelligent precision agriculture assistant for Indian farmers. "
                    "You provide safe, scientific, and data-backed advice across crop selection, soil management, plant diseases, and production trends. "
                    "Never recommend unsupported pesticide dosages. Always advise consulting local Krishi Vigyan Kendra (KVK) for chemical sprays. "
                    f"Farmer Context:\n"
                    f"- State: {state}, District: {district}\n"
                    f"- Soil Parameters: {soil}\n"
                    f"- Current Crop: {current_crop}\n"
                    f"- Latest Crop Recommendation: {latest_rec}\n"
                    f"- Latest Leaf Health Result: {latest_health}\n"
                    f"Preferred Language: {language} (en=English, hi=Hindi, hinglish=Hinglish)."
                )
                
                response = client.models.generate_content(
                    model="gemini-2.5-flash",
                    contents=message,
                    config={"system_instruction": system_instruction}
                )
                if response and response.text:
                    return {
                        "response": response.text.strip(),
                        "suggested_actions": self._generate_actions(lower_msg, context),
                        "grounding": "Gemini 2.5 Flash + Krishi360 Context"
                    }
            except Exception as e:
                print(f"Gemini API fallback to internal intelligence engine: {e}")

        # Intelligent Grounded Advisory Engine (Deterministic & Dataset-backed)
        return self._rule_grounded_response(lower_msg, text, context, language)

    def _safe_float(self, val, default: float) -> float:
        if val is None:
            return default
        try:
            return float(val)
        except (ValueError, TypeError):
            return default

    def _rule_grounded_response(self, lower_msg: str, original_msg: str, context: Dict[str, Any], lang: str) -> Dict[str, Any]:
        soil = context.get("soil") or {}
        latest_rec = context.get("latest_recommendation") or {}
        latest_health = context.get("latest_health") or {}
        location = context.get("location") or {}
        state = location.get("state") or "Punjab"
        district = location.get("district") or "Ludhiana"

        # 1. Soil & Crop Selection Queries
        has_soil_query = any(k in lower_msg for k in ["ph", "rainfall", "soil", "grow", "recommend", "npk", "nitrogen", "crop to plant"])
        if has_soil_query:
            n = 90.0
            p = 42.0
            k = 43.0
            temp = 25.0
            hum = 75.0
            ph = 6.5
            rain = 800.0

            ph_match = re.search(r"ph\s*[:=]?\s*([0-9.]+)", lower_msg)
            if ph_match:
                ph = self._safe_float(ph_match.group(1), ph)
            rain_match = re.search(r"rain(?:fall)?\s*[:=]?\s*([0-9.]+)", lower_msg)
            if rain_match:
                rain = self._safe_float(rain_match.group(1), rain)

            if soil and isinstance(soil, dict):
                n = self._safe_float(soil.get("n"), n)
                p = self._safe_float(soil.get("p"), p)
                k = self._safe_float(soil.get("k"), k)
                temp = self._safe_float(soil.get("temperature"), temp)
                hum = self._safe_float(soil.get("humidity"), hum)
                ph = self._safe_float(soil.get("ph"), ph)
                rain = self._safe_float(soil.get("rainfall"), rain)

            # Run ML model
            rec_res = self.crop_service.recommend(n, p, k, temp, hum, ph, rain)
            best_crop = rec_res["recommended_crop"]
            conf = rec_res["confidence"]
            top_crops = ", ".join([f"{c['crop']} ({c['confidence']}%)" for c in rec_res["top_recommendations"][:3]])

            if lang == "hi":
                resp = (
                    f"🌾 **मृदा विश्लेषण परिणाम:**\n"
                    f"आपके द्वारा दिए गए मृदा और जलवायु मानकों (pH: {ph}, वर्षा: {rain}mm, N: {n}, P: {p}, K: {k}) के आधार पर, "
                    f"हमारे AI मॉडल ने **{best_crop}** (विश्वास: {conf}%) की संस्तुति की है।\n\n"
                    f"शीर्ष 3 विकल्प: {top_crops}\n"
                    f"सलाह: बुवाई से पहले प्रमाणित बीजों का चयन करें और स्थानीय KVK से उर्वरक मात्रा की पुष्टि करें।"
                )
            elif lang == "hinglish":
                resp = (
                    f"🌾 **Soil Analysis Result:**\n"
                    f"Aapke soil aur climate parameters (pH: {ph}, Rainfall: {rain}mm, NPK: {n}-{p}-{k}) ke hisaab se, "
                    f"hamare AI model ne **{best_crop}** recommend kiya hai (Confidence: {conf}%).\n\n"
                    f"Top 3 crops: {top_crops}\n"
                    f"Suggestion: Sowing se pehle high quality certified seed use karein aur moisture maintain rakhein."
                )
            else:
                resp = (
                    f"🌾 **Soil-Based Crop Recommendation:**\n"
                    f"Based on your soil parameters (pH: {ph}, Rainfall: {rain}mm, N: {n}, P: {p}, K: {k}), "
                    f"the Krishi360 model identifies **{best_crop}** as the most suitable crop with **{conf}% confidence**.\n\n"
                    f"Top ranked crops: {top_crops}.\n"
                    f"Agronomic note: {rec_res['model_insight']}"
                )
            
            return {
                "response": resp,
                "suggested_actions": ["Analyze Farm Soil", "View Top 5 Recommendations", "Check Fertilizer Guidelines"],
                "grounding": "Krishi360 Crop Recommendation ML Model"
            }

        # 2. Disease & Leaf Health Queries
        has_health_query = any(k in lower_msg for k in ["disease", "leaf", "leaves", "unhealthy", "blight", "spots", "yellowing", "pest", "rot"])
        if has_health_query:
            if latest_health and isinstance(latest_health, dict) and latest_health.get("crop"):
                crop_name = latest_health.get("crop")
                cond = latest_health.get("condition")
                conf = latest_health.get("confidence")
                steps = latest_health.get("next_steps") or []
                steps_txt = "\n".join([f"- {s}" for s in steps[:3]]) if steps else "- Inspect foliage and ensure good airflow."

                if lang == "hi":
                    resp = (
                        f"🩺 **पत्ती स्वास्थ्य विश्लेषण ({crop_name}):**\n"
                        f"हालिया स्कैन में **{cond}** का पता चला है (विश्वास: {conf}%)।\n\n"
                        f"**सुरक्षित उपचार कदम:**\n{steps_txt}\n\n"
                        f"⚠️ रसायन छिड़काव से पहले अपने नजदीकी कृषि विज्ञान केंद्र (KVK) से संपर्क करें।"
                    )
                elif lang == "hinglish":
                    resp = (
                        f"🩺 **Crop Health Update ({crop_name}):**\n"
                        f"Aapke previous scan me **{cond}** detect hua tha (Confidence: {conf}%).\n\n"
                        f"**Recommended Steps:**\n{steps_txt}\n\n"
                        f"⚠️ KVK specialist ki salah ke bina koi heavy chemical spray na karein."
                    )
                else:
                    resp = (
                        f"🩺 **Plant Health Diagnosis ({crop_name}):**\n"
                        f"Your recent scan identified **{cond}** ({conf}% confidence).\n\n"
                        f"**Recommended Cultural Actions:**\n{steps_txt}\n\n"
                        f"⚠️ Please consult a local agricultural extension officer (KVK) for site-specific treatment."
                    )
                return {
                    "response": resp,
                    "suggested_actions": ["Scan Another Leaf", "View Disease Symptoms", "Consult Local KVK"],
                    "grounding": "PlantVillage MobileNetV2 Diagnostics"
                }
            else:
                if lang == "hi":
                    resp = (
                        "🩺 अपनी फसल की पत्ती की स्पष्ट फोटो 'Crop Health' सेक्शन में अपलोड करें। "
                        "हमारा AI मॉडल 38 विभिन्न फसल रोगों की पहचान कर सकता है और सुरक्षित जैविक उपचार की सलाह देगा।"
                    )
                elif lang == "hinglish":
                    resp = (
                        "🩺 Please apni crop leaf ki ek clear photo 'Crop Health' page pe upload karein. "
                        "Hamara MobileNetV2 model 38 plant disease classes detect karke safe organic remedies suggest karega."
                    )
                else:
                    resp = (
                        "🩺 To accurately assess your crop's health, please upload a clear photo of the affected leaf in our **Crop Health** tool. "
                        "Our model classifies 38 plant conditions across tomato, potato, corn, apple, grapes, and more, providing organic management steps."
                    )
                return {
                    "response": resp,
                    "suggested_actions": ["Upload Leaf Image", "Explore Sample Leaves", "Read Disease Symptoms"],
                    "grounding": "PlantVillage Diagnostic Engine"
                }

        # 3. Production & Historical Yield Queries
        has_prod_query = any(k in lower_msg for k in ["production", "yield", "district", "state", "trend", "harvest", "quintal", "tonnes"])
        if has_prod_query:
            target_crop = "Rice"
            for c in ["Wheat", "Rice", "Maize", "Cotton", "Sugarcane", "Potato", "Bajra", "Jowar"]:
                if c.lower() in lower_msg:
                    target_crop = c
                    break

            # Fetch regional analytics
            drill = self.production_service.get_regional_drilldown(state, district, target_crop)
            records = drill.get("records") or []

            if records:
                recent = records[-1]
                avg_yield = round(sum(r.get("yield", 0) for r in records) / len(records), 2)
                yr = recent.get("year", 2015)
                prod = recent.get("production", 0)
                yd = recent.get("yield", 0)
                
                if lang == "hi":
                    resp = (
                        f"📊 **{state} के {district} जिले में {target_crop} उत्पादन रिपोर्ट:**\n"
                        f"- ऐतिहासिक रिकॉर्ड्स: {len(records)} वर्ष\n"
                        f"- औसत ऐतिहासिक उपज: **{avg_yield} टन/हेक्टेयर**\n"
                        f"- नवीनतम रिकॉर्ड ({yr}): उत्पादन {prod:,.0f} टन, उपज **{yd} टन/हेक्टेयर**\n"
                        f"यह डेटा भारत सरकार के कृषि मंत्रालय के आधिकारिक रिकॉर्ड्स पर आधारित है।"
                    )
                elif lang == "hinglish":
                    resp = (
                        f"📊 **{district}, {state} me {target_crop} Production Analysis:**\n"
                        f"- Total data records: {len(records)} seasons\n"
                        f"- Historical Average Yield: **{avg_yield} tonnes/ha**\n"
                        f"- Latest recorded data ({yr}): Production {prod:,.0f} tonnes, Yield **{yd} tonnes/ha**\n"
                        f"Full charts dekhne ke liye Production page visit karein."
                    )
                else:
                    resp = (
                        f"📊 **{target_crop} Production Intelligence for {district}, {state}:**\n"
                        f"- Historical records analyzed: {len(records)} entries\n"
                        f"- Historical average yield: **{avg_yield} tonnes/hectare**\n"
                        f"- Latest benchmark ({yr}): Total Production {prod:,.0f} tonnes with **{yd} t/ha** yield.\n"
                        f"Historical trends show seasonal shifts between Kharif and Rabi cycles."
                    )
            else:
                resp = (
                    f"📊 Historical agricultural records for {target_crop} in {district}, {state} show active cultivation. "
                    f"You can explore full multi-year trend charts, area vs production correlation, and seasonal distributions in the **Production Intelligence** tab."
                )

            return {
                "response": resp,
                "suggested_actions": ["View Production Charts", "Predict Future Yield", "Compare Districts"],
                "grounding": "Indian Crop Production Dataset (246K+ records)"
            }

        # 4. Contextual Greeting / Overview
        context_hint = ""
        if latest_rec and isinstance(latest_rec, dict) and latest_rec.get("recommended_crop"):
            context_hint = f" Based on your recent farm assessment, **{latest_rec['recommended_crop']}** was recommended for your soil."

        if lang == "hi":
            resp = (
                f"नमस्ते किसान भाई! 🌱 मैं **कृषिमित्र (KrishiMitra AI)** हूँ।{context_hint}\n"
                f"आप मुझसे मिट्टी परीक्षण (NPK/pH), फसल चयन, पत्ती के रोगों, या {state} के उत्पादन आंकड़ों के बारे में कुछ भी पूछ सकते हैं।"
            )
        elif lang == "hinglish":
            resp = (
                f"Namaste! 🌱 Main **KrishiMitra AI** hoon, aapka agricultural advisor.{context_hint}\n"
                f"Aap mujhse soil testing, crop recommendations, plant disease scanning, ya {state} ke production records ke baare me pooch sakte hain!"
            )
        else:
            resp = (
                f"Hello! 🌱 I am **KrishiMitra AI**, your precision agricultural assistant.{context_hint}\n\n"
                f"You can ask me about:\n"
                f"• **Crop Selection:** 'My soil pH is 6.5 and rainfall is 900mm. What should I grow?'\n"
                f"• **Plant Health:** 'My leaves have dark spots with yellow halos. What disease is this?'\n"
                f"• **Production Intelligence:** 'What is the historical yield of rice in {district}, {state}?'\n"
                f"• **Complete Farm Plan:** 'Help me plan crop rotation and fertilizer management.'"
            )

        return {
            "response": resp,
            "suggested_actions": ["Analyze Soil", "Scan Crop Leaf", "Explore Production Trends"],
            "grounding": "Krishi360 Multi-Engine Intelligence"
        }

    def _generate_actions(self, lower_msg: str, context: Dict[str, Any]) -> List[str]:
        if "leaf" in lower_msg or "disease" in lower_msg:
            return ["Scan Leaf Photo", "View Safe Remedies", "Locate Nearest KVK"]
        elif "soil" in lower_msg or "grow" in lower_msg:
            return ["Run Soil Recommendation", "View Top 5 Crops", "Calculate Fertilizer"]
        return ["Complete Farm Analysis", "Check Regional Yield", "Download Farm Report"]
