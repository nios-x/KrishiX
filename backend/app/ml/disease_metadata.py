"""Plant disease metadata, symptoms, and safe recommended actions for 38 PlantVillage classes."""

DISEASE_METADATA = {
    # Apple
    "Apple Scab": {
        "crop": "Apple",
        "condition": "Apple Scab",
        "pathogen": "Fungus (Venturia inaequalis)",
        "is_healthy": False,
        "symptoms": [
            "Olive-green to brown velvety spots on the upper leaf surface",
            "Spots become darker, corky, and distorted over time",
            "Premature leaf drop and cracked, scabby fruit surfaces"
        ],
        "next_steps": [
            "Rake and destroy fallen leaves during autumn to eliminate overwintering spores.",
            "Prune canopy branches to improve air circulation and accelerate foliage drying.",
            "Apply approved organic copper or sulfur-based fungicidal sprays during early bud break if wet weather persists.",
            "Consult your nearest Krishi Vigyan Kendra (KVK) or horticulture officer for local spray scheduling."
        ]
    },
    "Apple with Black Rot": {
        "crop": "Apple",
        "condition": "Black Rot (Frogeye Leaf Spot)",
        "pathogen": "Fungus (Botryosphaeria obtusa)",
        "is_healthy": False,
        "symptoms": [
            "Small purple spots on upper leaf surfaces that enlarge with light tan centers ('frogeye' appearance)",
            "Sunken reddish-brown cankers on twigs and limbs",
            "Fruit exhibits concentric brown rings and mummifies on the tree"
        ],
        "next_steps": [
            "Prune out dead wood, cankers, and mummified fruit, and burn or bury them away from orchards.",
            "Sterilize pruning tools with 70% alcohol or 10% bleach solution between cuts.",
            "Avoid wounding trees during harvest and maintain tree vigor with balanced nutrition.",
            "Consult a local horticulture specialist for regional fungicide management guidelines."
        ]
    },
    "Cedar Apple Rust": {
        "crop": "Apple",
        "condition": "Cedar Apple Rust",
        "pathogen": "Fungus (Gymnosporangium juniperi-virginianae)",
        "is_healthy": False,
        "symptoms": [
            "Bright yellow-orange or rust-colored spots on upper leaf surfaces",
            "Small tube-like fruiting structures (aecia) erupting beneath the leaf",
            "Distorted leaves and premature defoliation during severe infections"
        ],
        "next_steps": [
            "Remove alternate host plants (such as eastern red cedar or wild junipers) in proximity to the orchard.",
            "Plant resistant apple varieties if re-planting or grafting.",
            "Apply protective preventative organic sprays during spring pink bud stages.",
            "Consult your local state agricultural extension officer for rust-resistant cultivars."
        ]
    },
    "Healthy Apple": {
        "crop": "Apple",
        "condition": "Healthy Foliage",
        "pathogen": "None",
        "is_healthy": True,
        "symptoms": ["No visible disease symptoms or chlorosis", "Vigorous green leaves with uniform texture"],
        "next_steps": [
            "Continue standard integrated nutrient and irrigation management.",
            "Perform routine weekly scouting for early detection of pests like aphids or mites.",
            "Maintain balanced soil potassium and nitrogen levels for sustained fruit development."
        ]
    },

    # Blueberry
    "Healthy Blueberry Plant": {
        "crop": "Blueberry",
        "condition": "Healthy Foliage",
        "pathogen": "None",
        "is_healthy": True,
        "symptoms": ["Foliage is vibrant green and firm", "Consistent growth nodes without spotting"],
        "next_steps": [
            "Maintain acidic soil pH (4.5–5.5) using organic sulfur or pine needle mulches.",
            "Ensure uniform soil moisture through drip irrigation."
        ]
    },

    # Cherry
    "Cherry with Powdery Mildew": {
        "crop": "Cherry",
        "condition": "Powdery Mildew",
        "pathogen": "Fungus (Podosphaera clandestina)",
        "is_healthy": False,
        "symptoms": [
            "White, powdery fungal patches on young leaves and succulent shoots",
            "Leaves curl upward, cup, or become blistered and stunted",
            "Infected fruit appears dull and can crack prematurely"
        ],
        "next_steps": [
            "Prune water sprouts and dense inner branches to maximize sunlight penetration.",
            "Apply potassium bicarbonate or neem oil emulsions in early morning or overcast days.",
            "Avoid excessive late-season nitrogen fertilization which induces vulnerable lush growth.",
            "Consult your local KVK for approved mildew management options."
        ]
    },
    "Healthy Cherry Plant": {
        "crop": "Cherry",
        "condition": "Healthy Foliage",
        "pathogen": "None",
        "is_healthy": True,
        "symptoms": ["Smooth, dark green foliage", "Healthy terminal shoot growth"],
        "next_steps": [
            "Maintain moderate irrigation avoiding waterlogging.",
            "Scout regularly for cherry fruit fly and bacterial canker."
        ]
    },

    # Corn (Maize)
    "Corn (Maize) with Cercospora and Gray Leaf Spot": {
        "crop": "Corn (Maize)",
        "condition": "Gray Leaf Spot",
        "pathogen": "Fungus (Cercospora zeae-maydis)",
        "is_healthy": False,
        "symptoms": [
            "Tan to gray rectangular lesions strictly bounded by leaf veins",
            "Lesions coalesce, causing extensive blighting of upper canopy leaves",
            "Premature stalk lodging due to loss of photosynthetic leaf area"
        ],
        "next_steps": [
            "Practice crop rotation with non-host crops like soybean or pulses for at least one season.",
            "Incorporate crop residues deeply into soil through tillage to accelerate breakdown of fungal inoculum.",
            "Select high-yielding hybrids with proven field tolerance to Gray Leaf Spot.",
            "Consult local agricultural extension for economic threshold guidelines regarding fungicide applications."
        ]
    },
    "Corn (Maize) with Common Rust": {
        "crop": "Corn (Maize)",
        "condition": "Common Rust",
        "pathogen": "Fungus (Puccinia sorghi)",
        "is_healthy": False,
        "symptoms": [
            "Cinnamon-brown to golden-brown pustules scattered across both leaf surfaces",
            "Pustules rupture epidermal tissue, releasing powdery spores",
            "Leaves turn chlorotic and desiccate under high disease pressure"
        ],
        "next_steps": [
            "Plant resistant or tolerant maize hybrid varieties suitable for your agro-climatic zone.",
            "Monitor fields closely if cool (16-25°C) and humid weather conditions prevail.",
            "Fungicidal treatments are generally recommended only if rust appears on upper canopy leaves before tasseling; consult local KVK."
        ]
    },
    "Corn (Maize) with Northern Leaf Blight": {
        "crop": "Corn (Maize)",
        "condition": "Northern Corn Leaf Blight",
        "pathogen": "Fungus (Exserohilum turcicum)",
        "is_healthy": False,
        "symptoms": [
            "Long, elliptical, cigar-shaped grayish-green to tan lesions (2.5 to 15 cm long)",
            "Lesions develop dark olive-gray fungal fuzz during humid conditions",
            "Extensive leaf death from lower leaves upward"
        ],
        "next_steps": [
            "Use certified seeds of resistant hybrids possessing Ht-resistance genes.",
            "Implement deep tillage after harvest to bury infected stover.",
            "Rotate crops with non-graminaceous crops (e.g., legumes or oilseeds).",
            "Consult your block agricultural extension officer for regional spray recommendations."
        ]
    },
    "Healthy Corn (Maize)": {
        "crop": "Corn (Maize)",
        "condition": "Healthy Foliage",
        "pathogen": "None",
        "is_healthy": True,
        "symptoms": ["Vigorous green leaves with intact veins", "Healthy whorl and tassel emergence"],
        "next_steps": [
            "Maintain recommended split nitrogen fertilizer application (basal, knee-high, tasseling).",
            "Keep field free of competing grassy weeds during critical first 45 days."
        ]
    },

    # Grape
    "Grape with Black Rot": {
        "crop": "Grape",
        "condition": "Black Rot",
        "pathogen": "Fungus (Guignardia bidwellii)",
        "is_healthy": False,
        "symptoms": [
            "Circular reddish-brown spots on leaves surrounded by a dark border with tiny black pimples (pycnidia)",
            "Berries shrivel into hard, black, wrinkled mummies that remain attached to the cluster",
            "Black elliptical cankers on young shoots and petioles"
        ],
        "next_steps": [
            "Remove and destroy all mummified fruit clusters from vines and ground during winter pruning.",
            "Practice canopy management (leaf removal around fruit zone) to enhance air movement and reduce drying time.",
            "Apply protective organic copper sprays prior to bloom and immediately after fruit set.",
            "Seek guidance from the National Research Centre for Grapes (NRCG) or local horticulture officer."
        ]
    },
    "Grape with Esca (Black Measles)": {
        "crop": "Grape",
        "condition": "Esca (Black Measles)",
        "pathogen": "Fungal Complex (Phaeomoniella chlamydospora & Phaeoacremonium)",
        "is_healthy": False,
        "symptoms": [
            "Tiger-stripe pattern of interveinal chlorosis and necrotic reddish-brown bands on leaves",
            "Dark spots ('measles') on white and red grape berry skins",
            "Sudden vine apoplexy (wilting and leaf drop in hot dry weather)"
        ],
        "next_steps": [
            "Avoid large pruning wounds during wet weather; treat cuts with pruning wound sealants.",
            "Prune late in the dormant season when wound healing is most rapid.",
            "Uproot and burn severely infected dying vines to prevent pathogen spread to adjacent rows.",
            "Consult a viticulture specialist for trunk renewal strategies."
        ]
    },
    "Grape with Leaf Blight": {
        "crop": "Grape",
        "condition": "Leaf Blight (Isariopsis Spot)",
        "pathogen": "Fungus (Pseudocercospora vitis)",
        "is_healthy": False,
        "symptoms": [
            "Irregular, dark reddish-brown angular spots on older leaves",
            "Under humid weather, a velvety olive-brown spore layer forms on leaf undersides",
            "Premature defoliation resulting in sunburned fruit and poor cane maturation"
        ],
        "next_steps": [
            "Clean up dropped leaf litter after harvest to lower inoculum levels.",
            "Ensure proper vine trellising and spacing to promote air circulation.",
            "Apply preventative biocontrol agents or copper-based sprays during monsoon breaks.",
            "Contact your local district agricultural office for grape health monitoring."
        ]
    },
    "Healthy Grape Plant": {
        "crop": "Grape",
        "condition": "Healthy Foliage",
        "pathogen": "None",
        "is_healthy": True,
        "symptoms": ["Uniform green leaves with well-defined margins", "Robust cane extension and cluster set"],
        "next_steps": [
            "Maintain balanced fertigation and regular canopy training.",
            "Conduct routine scouting for downy mildew and thrips."
        ]
    },

    # Orange / Citrus
    "Orange with Citrus Greening": {
        "crop": "Orange (Citrus)",
        "condition": "Citrus Greening (Huanglongbing / HLB)",
        "pathogen": "Bacterium (Candidatus Liberibacter asiaticus) vectored by Asian Citrus Psyllid",
        "is_healthy": False,
        "symptoms": [
            "Asymmetrical, blotchy mottled yellowing pattern on leaves ('yellow dragon')",
            "Hard, upright leaves showing zinc/iron deficiency patterns that cross veins",
            "Small, lopsided, bitter fruit that remains green at the blossom end",
            "Dieback of twigs and eventual tree decline"
        ],
        "next_steps": [
            "Regularly monitor and manage the vector Asian citrus psyllid (Diaphorina citri) using yellow sticky traps and integrated pest management.",
            "Uproot and burn severely infected decline trees to protect remaining orchard blocks.",
            "Use only certified disease-free budwood and nursery saplings.",
            "Immediately notify your state horticulture department or local agricultural university."
        ]
    },

    # Peach
    "Peach with Bacterial Spot": {
        "crop": "Peach",
        "condition": "Bacterial Spot",
        "pathogen": "Bacterium (Xanthomonas arboricola pv. pruni)",
        "is_healthy": False,
        "symptoms": [
            "Angular purple-brown lesions on leaves that dry and drop out ('shot-hole' effect)",
            "Leaves turn yellow and drop prematurely, starting from older lower foliage",
            "Pitted and cracked spots on fruit with gummy bacterial exudate"
        ],
        "next_steps": [
            "Plant windbreaks around orchards to reduce sand abrasion and wind-driven rain dissemination.",
            "Avoid overhead irrigation; use drip or furrow systems instead.",
            "Apply dormant copper sprays before bud swell to suppress overwintered bacterial colonies.",
            "Consult a fruit tree specialist for bactericide timing and resistant rootstocks."
        ]
    },
    "Healthy Peach Plant": {
        "crop": "Peach",
        "condition": "Healthy Foliage",
        "pathogen": "None",
        "is_healthy": True,
        "symptoms": ["Bright, lance-shaped green leaves", "Smooth bark and healthy shoot growth"],
        "next_steps": [
            "Maintain soil drainage and root zone aeration.",
            "Scout for peach tree borer and leaf curl."
        ]
    },

    # Pepper (Bell)
    "Bell Pepper with Bacterial Spot": {
        "crop": "Bell Pepper (Capsicum)",
        "condition": "Bacterial Spot",
        "pathogen": "Bacterium (Xanthomonas euvesicatoria)",
        "is_healthy": False,
        "symptoms": [
            "Small, water-soaked, circular to irregular lesions on foliage",
            "Lesions turn dark brown to black with slightly raised blistered margins",
            "Severe leaf drop leading to exposed fruit and subsequent sunscald"
        ],
        "next_steps": [
            "Use certified pathogen-free treated seed and healthy seedlings.",
            "Avoid working in fields when foliage is wet from rain or dew.",
            "Implement a minimum 2-year crop rotation with non-solanaceous crops.",
            "Apply approved copper-based bactericidal sprays at first sign of spotting under extension guidance."
        ]
    },
    "Healthy Bell Pepper Plant": {
        "crop": "Bell Pepper (Capsicum)",
        "condition": "Healthy Foliage",
        "pathogen": "None",
        "is_healthy": True,
        "symptoms": ["Uniform green leaves free of spotting or curling", "Healthy floral buds and fruit set"],
        "next_steps": [
            "Ensure regular calcium supply to prevent blossom end rot.",
            "Maintain consistent soil moisture using organic mulch."
        ]
    },

    # Potato
    "Potato with Early Blight": {
        "crop": "Potato",
        "condition": "Early Blight",
        "pathogen": "Fungus (Alternaria solani)",
        "is_healthy": False,
        "symptoms": [
            "Dark brown to black concentric rings creating a 'target board' pattern on older leaves",
            "Chlorotic yellow halo surrounding the circular target lesions",
            "Leaves turn brown, wither, and die while remaining attached to stems"
        ],
        "next_steps": [
            "Practice a 3-year crop rotation avoiding other solanaceous crops like tomato and eggplant.",
            "Maintain adequate plant nutrition, especially nitrogen and potassium, to prevent plant stress.",
            "Apply drip irrigation to keep foliage dry, or irrigate early in the morning.",
            "Consult your nearest KVK for approved protective bio-fungicides or spray schedules."
        ]
    },
    "Potato with Late Blight": {
        "crop": "Potato",
        "condition": "Late Blight",
        "pathogen": "Oomycete (Phytophthora infestans)",
        "is_healthy": False,
        "symptoms": [
            "Large, water-soaked irregular dark green to purplish-black lesions on leaf margins and tips",
            "White delicate downy fungal mold visible on leaf undersides in humid conditions",
            "Rapid collapse of foliage and dark brown foul-smelling rot spreading through stems and tubers"
        ],
        "next_steps": [
            "Destroy infected cull piles and volunteer potato plants which harbor overwintering inoculum.",
            "Hilling up soil around potato hills to provide a protective barrier preventing spores from washing into tubers.",
            "Apply preventative protectant sprays during cool, overcast, and high-humidity weather periods.",
            "Urgent: Contact your state potato research station or local KVK for emergency disease alert warnings."
        ]
    },
    "Healthy Potato Plant": {
        "crop": "Potato",
        "condition": "Healthy Foliage",
        "pathogen": "None",
        "is_healthy": True,
        "symptoms": ["Lush dark green compound leaves", "Sturdy stems and vigorous stolon growth"],
        "next_steps": [
            "Hill up ridges to ensure expanding tubers remain shielded from light.",
            "Scout twice weekly for early/late blight symptoms, especially during monsoon showers."
        ]
    },

    # Raspberry
    "Healthy Raspberry Plant": {
        "crop": "Raspberry",
        "condition": "Healthy Foliage",
        "pathogen": "None",
        "is_healthy": True,
        "symptoms": ["Clean trifoliate leaves with vibrant green color", "Healthy primocane development"],
        "next_steps": [
            "Trellis canes for adequate aeration.",
            "Prune floricanes immediately after harvesting."
        ]
    },

    # Soybean
    "Healthy Soybean Plant": {
        "crop": "Soybean",
        "condition": "Healthy Foliage",
        "pathogen": "None",
        "is_healthy": True,
        "symptoms": ["Trifoliate leaves are clean and vigorous", "Active nodulation at roots"],
        "next_steps": [
            "Maintain soil phosphorus and inoculation with Rhizobium culture.",
            "Scout for stem fly and semilooper during vegetative phase."
        ]
    },

    # Squash
    "Squash with Powdery Mildew": {
        "crop": "Squash",
        "condition": "Powdery Mildew",
        "pathogen": "Fungus (Podosphaera xanthii)",
        "is_healthy": False,
        "symptoms": [
            "Powdery white fungal spots on upper and lower leaf surfaces, petioles, and stems",
            "Leaves turn chlorotic yellow, become brown and papery, and wither prematurely",
            "Premature ripening and sunscald of exposed fruit"
        ],
        "next_steps": [
            "Select powdery mildew-resistant squash and cucurbit varieties.",
            "Ensure wide plant spacing to improve sunlight penetration and air movement.",
            "Apply milk-water solution (1:9 ratio) or potassium bicarbonate spray at early appearance.",
            "Consult local agriculture extension officer for safe registered fungicide options."
        ]
    },

    # Strawberry
    "Strawberry with Leaf Scorch": {
        "crop": "Strawberry",
        "condition": "Leaf Scorch",
        "pathogen": "Fungus (Diplocarpon earlianum)",
        "is_healthy": False,
        "symptoms": [
            "Small, irregular purple to dark brown spots on upper leaf surfaces without clear margins",
            "Spots coalesce, giving foliage a scorched or burned appearance",
            "Leaf margins curl upward and dry out prematurely"
        ],
        "next_steps": [
            "Plant in well-drained raised beds with plastic or straw mulching.",
            "Avoid sprinkler irrigation; use drip tape beneath mulch.",
            "Mow and destroy diseased old leaves after the final harvest.",
            "Consult horticulture extension specialists for certified disease-free runners."
        ]
    },
    "Healthy Strawberry Plant": {
        "crop": "Strawberry",
        "condition": "Healthy Foliage",
        "pathogen": "None",
        "is_healthy": True,
        "symptoms": ["Deep green glossy leaves with sharp dentate margins", "Healthy crown with active blossoms"],
        "next_steps": [
            "Maintain raised bed mulch to keep berries clean.",
            "Ensure regular irrigation during flowering and fruit sizing."
        ]
    },

    # Tomato
    "Tomato with Bacterial Spot": {
        "crop": "Tomato",
        "condition": "Bacterial Spot",
        "pathogen": "Bacterium (Xanthomonas spp.)",
        "is_healthy": False,
        "symptoms": [
            "Small, water-soaked, dark circular to angular spots (1-3 mm) on leaves",
            "Spots become black and necrotic, often surrounded by a light yellow halo",
            "Defoliation of lower canopy leads to sunscald on maturing fruit"
        ],
        "next_steps": [
            "Never save seed from infected tomato crops; use only certified pathogen-free seeds.",
            "Disinfect stakes, cages, and tools before reuse.",
            "Avoid overhead irrigation and avoid entering field when foliage is wet.",
            "Consult your local KVK for integrated bactericide schedules."
        ]
    },
    "Tomato with Early Blight": {
        "crop": "Tomato",
        "condition": "Early Blight",
        "pathogen": "Fungus (Alternaria solani)",
        "is_healthy": False,
        "symptoms": [
            "Concentric rings producing a 'target-board' pattern on older lower leaves",
            "Chlorotic yellow tissue surrounding the circular brown lesions",
            "Stem collar rot on young seedlings and dark leathery lesions at stem end of fruit"
        ],
        "next_steps": [
            "Prune lower leaves that touch the soil surface to break soil splash transmission.",
            "Apply straw or plastic mulch around the plant base.",
            "Stake and trellis vines to elevate foliage into well-ventilated air.",
            "Consult local extension officer for recommended preventive bio-fungicides."
        ]
    },
    "Tomato with Late Blight": {
        "crop": "Tomato",
        "condition": "Late Blight",
        "pathogen": "Oomycete (Phytophthora infestans)",
        "is_healthy": False,
        "symptoms": [
            "Large, irregular water-soaked spots on leaves that rapidly turn dark brown or purplish-black",
            "White fungal mildew forming on the undersides of infected leaves during moist mornings",
            "Dark brown, greasy lesions spreading across green fruit, rendering them inedible"
        ],
        "next_steps": [
            "Immediately remove and safely destroy severely infected plants to prevent airborne spore dispersion.",
            "Avoid overhead watering and ensure adequate planting distance for air flow.",
            "Scout daily during prolonged cool, cloudy, and wet periods.",
            "Urgent: Contact your district agricultural officer or KVK for regional disease management alerts."
        ]
    },
    "Tomato with Leaf Mold": {
        "crop": "Tomato",
        "condition": "Leaf Mold",
        "pathogen": "Fungus (Passalora fulva)",
        "is_healthy": False,
        "symptoms": [
            "Pale green to yellowish spots with indistinct margins on the upper leaf surface",
            "Dense olive-green to grayish-brown velvety fungal mold on the leaf underside",
            "Leaves turn yellow, curl, wither, and drop prematurely"
        ],
        "next_steps": [
            "Increase greenhouse or field ventilation and reduce relative humidity below 85%.",
            "Space plants adequately to facilitate maximum airflow across the canopy.",
            "Water early in the day so foliage dries rapidly before evening.",
            "Consult agricultural experts for resistant tomato hybrids."
        ]
    },
    "Tomato with Septoria Leaf Spot": {
        "crop": "Tomato",
        "condition": "Septoria Leaf Spot",
        "pathogen": "Fungus (Septoria lycopersici)",
        "is_healthy": False,
        "symptoms": [
            "Numerous small circular spots (2-3 mm) with gray or tan centers and dark brown margins",
            "Tiny black specks (pycnidia) clearly visible in the center of mature spots",
            "Progressive defoliation from bottom leaves upward, exposing green fruit"
        ],
        "next_steps": [
            "Plow under or remove all tomato residues immediately following harvest.",
            "Avoid overhead watering; use furrow or drip systems.",
            "Rotate crops for at least 2 years out of solanaceous vegetables.",
            "Consult KVK for safe protectant sprays early in the growing cycle."
        ]
    },
    "Tomato with Two-Spotted Spider Mite": {
        "crop": "Tomato",
        "condition": "Two-Spotted Spider Mites",
        "pathogen": "Pest (Tetranychus urticae)",
        "is_healthy": False,
        "symptoms": [
            "Fine yellow stippling or speckling across upper leaf surfaces",
            "Silken webbing on the undersides of leaves and at shoot tips",
            "Leaves turn bronzed, dry, and brittle under hot, dry conditions"
        ],
        "next_steps": [
            "Spray plants with a strong stream of water to dislodge mites and disrupt webbing.",
            "Release beneficial predatory mites (e.g., Phytoseiulus persimilis) in enclosed greenhouses.",
            "Apply neem oil or insecticidal soap sprays thoroughly coating leaf undersides.",
            "Avoid broad-spectrum chemical insecticides that eliminate natural spider mite predators."
        ]
    },
    "Tomato with Target Spot": {
        "crop": "Tomato",
        "condition": "Target Spot",
        "pathogen": "Fungus (Corynespora cassiicola)",
        "is_healthy": False,
        "symptoms": [
            "Small pinpoint water-soaked lesions that enlarge into circular brown lesions with light brown centers",
            "Zonate concentric rings similar to early blight but typically distributed throughout the canopy",
            "Sunken circular lesions with dark margins on ripe tomato fruit"
        ],
        "next_steps": [
            "Ensure proper vine trellising and pruning of suckers to improve sunlight penetration.",
            "Keep soil evenly moist using mulch, avoiding water stress.",
            "Destroy crop debris after final harvest.",
            "Consult your local agricultural extension service for recommended treatments."
        ]
    },
    "Tomato with Yellow Leaf Curl Virus": {
        "crop": "Tomato",
        "condition": "Yellow Leaf Curl Virus (TYLCV)",
        "pathogen": "Begomovirus transmitted by Whiteflies (Bemisia tabaci)",
        "is_healthy": False,
        "symptoms": [
            "Severe upward curling and cupping of leaf margins",
            "Distinct yellowing (chlorosis) along leaf edges and between veins",
            "Extreme stunting of plant growth with bushy appearance and severe reduction in fruit set"
        ],
        "next_steps": [
            "Control vector whiteflies using yellow sticky traps and reflective silver mulches.",
            "Install 40-50 mesh insect-proof nets in nursery seedbeds.",
            "Rogue out and destroy infected viral plants immediately upon symptom detection.",
            "Plant TYLCV-resistant tomato hybrids (e.g., varieties with Ty-1 or Ty-3 resistance genes)."
        ]
    },
    "Tomato with Tomato Mosaic Virus": {
        "crop": "Tomato",
        "condition": "Tomato Mosaic Virus (ToMV)",
        "pathogen": "Tobamovirus (Mechanically transmitted)",
        "is_healthy": False,
        "symptoms": [
            "Mottled light and dark green mosaic patterns on foliage",
            "Leaves appear blistered, distorted, and fern-like ('shoestringing')",
            "Uneven fruit ripening with internal brown necrotic streaks"
        ],
        "next_steps": [
            "Disinfect hands and tools in 20% non-fat dry milk solution or soap before handling plants.",
            "Strictly prohibit smoking or tobacco usage in greenhouses (tobacco harbors related mosaic viruses).",
            "Carefully rogue and destroy infected plants; do not compost them.",
            "Select ToMV-resistant commercial tomato varieties."
        ]
    },
    "Healthy Tomato Plant": {
        "crop": "Tomato",
        "condition": "Healthy Foliage",
        "pathogen": "None",
        "is_healthy": True,
        "symptoms": ["Lush, deep green pinnate leaves", "Sturdy stems with vigorous flowering trusses"],
        "next_steps": [
            "Maintain consistent drip irrigation and regular trellising.",
            "Apply balanced NPK fertilization with calcium to guard against blossom end rot.",
            "Conduct twice-weekly scouting for early detection of blight or whiteflies."
        ]
    }
}


def get_disease_info(label: str) -> dict:
    """Retrieve metadata, symptoms, and safe recommendations for a predicted label."""
    # Match exact label or normalized label
    if label in DISEASE_METADATA:
        return DISEASE_METADATA[label]

    # Try matching without prefixes or variations
    for key, val in DISEASE_METADATA.items():
        if key.lower() == label.lower():
            return val

    # Fallback generic info
    return {
        "crop": "Crop",
        "condition": label,
        "pathogen": "Unknown",
        "is_healthy": "healthy" in label.lower(),
        "symptoms": [
            "Leaf tissue demonstrates discoloration or structural irregularity.",
            "Detailed symptom patterns correspond to dataset training classes."
        ],
        "next_steps": [
            "Isolate suspicious plants to prevent potential spread to neighboring rows.",
            "Ensure leaves remain dry during watering and improve air circulation.",
            "Consult your local Krishi Vigyan Kendra (KVK) or agriculture department officer for an on-site diagnosis."
        ]
    }
