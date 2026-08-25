export type Severity = "healthy" | "warning" | "disease";

export interface DiseaseInfo {
  displayName: string;
  shortDesc: string;
  description: string;
  action: string;
  solution: string;
  severity: Severity;
}

export const DISEASE_KNOWLEDGE: Record<string, DiseaseInfo> = {
  healthy: {
    displayName: "Healthy",
    shortDesc: "No disease detected",
    description:
      "The wheat plant shows no signs of disease. Leaf tissue appears normal with healthy green coloration and no visible lesions, pustules, or discoloration.",
    action: "Maintain current crop management practices.",
    solution:
      "Continue routine monitoring every 7–10 days. Ensure proper nutrition, irrigation, and preventive fungicide schedules if disease pressure is high in the region.",
    severity: "healthy",
  },
  "yellow rust": {
    displayName: "Yellow Rust",
    shortDesc: "Puccinia striiformis",
    description:
      "Yellow rust (stripe rust) is caused by Puccinia striiformis. It appears as yellow-orange pustules arranged in stripes along the leaf veins. Thrives in cool, moist conditions and spreads rapidly under favorable weather.",
    action: "Apply foliar fungicide immediately. Prioritize fields with high infection density.",
    solution:
      "1. Apply triazole or strobilurin-based fungicide at first symptom appearance.\n2. Remove and destroy heavily infected crop debris.\n3. Plant resistant varieties in subsequent seasons.\n4. Monitor neighboring fields — disease spreads via wind.",
    severity: "disease",
  },
  "brown rust": {
    displayName: "Brown Rust",
    shortDesc: "Puccinia triticina",
    description:
      "Brown rust (leaf rust) is caused by Puccinia triticina. Circular to oval orange-brown pustules appear scattered on the leaf surface. Common in warm, humid conditions.",
    action: "Apply fungicide treatment. Monitor spread to flag leaves and head.",
    solution:
      "1. Apply triazole fungicide when disease covers >5% leaf area.\n2. Ensure proper plant spacing for air circulation.\n3. Remove infected crop residue after harvest.\n4. Use certified resistant seed varieties.",
    severity: "disease",
  },
  "black rust": {
    displayName: "Black Rust",
    shortDesc: "Puccinia graminis",
    description:
      "Black rust (stem rust) caused by Puccinia graminis produces dark reddish-brown to black pustules on stems and leaves. One of the most destructive wheat diseases, capable of causing complete crop loss.",
    action: "Immediate fungicide application required. Alert local agricultural authority.",
    solution:
      "1. Apply systemic fungicide (tebuconazole or propiconazole) urgently.\n2. Harvest early if infection is severe to minimize losses.\n3. Report to regional agricultural extension.\n4. Plant Ug99-resistant varieties in future seasons.",
    severity: "disease",
  },
  "fusarium head blight": {
    displayName: "Fusarium Head Blight",
    shortDesc: "Fusarium graminearum",
    description:
      "Fusarium head blight (scab) infects wheat heads during flowering. Produces bleached spikelets with pink-orange mold. Produces mycotoxins (DON/vomitoxin) that render grain unsafe for human or animal consumption.",
    action: "Apply fungicide at flowering stage. Do not use infected grain for feed.",
    solution:
      "1. Apply DMI or SDHI fungicide at 25–50% heading stage.\n2. Do not use infected grain for food or animal feed.\n3. Harvest at proper moisture, dry quickly to prevent further mycotoxin accumulation.\n4. Rotate with non-host crops (corn, soybean).",
    severity: "disease",
  },
  mildew: {
    displayName: "Powdery Mildew",
    shortDesc: "Blumeria graminis",
    description:
      "Powdery mildew caused by Blumeria graminis forms white powdery colonies on leaf surfaces. Thrives in high humidity and dense canopies. Reduces photosynthesis and can lower yield by 5–30%.",
    action: "Apply fungicide. Improve field ventilation where possible.",
    solution:
      "1. Apply triazole fungicide at early infection stage.\n2. Reduce nitrogen over-application that promotes lush susceptible growth.\n3. Ensure adequate row spacing for airflow.\n4. Select mildew-resistant cultivars for future planting.",
    severity: "disease",
  },
  septoria: {
    displayName: "Septoria Leaf Blotch",
    shortDesc: "Zymoseptoria tritici",
    description:
      "Septoria leaf blotch caused by Zymoseptoria tritici produces irregular tan to brown lesions with small black pycnidia (spore-producing bodies). Spreads upward through the canopy via rain splash. Major yield reducer in humid climates.",
    action: "Apply fungicide to protect flag leaf and upper canopy.",
    solution:
      "1. Apply SDHI or triazole fungicide at GS31–39 to protect flag leaf.\n2. Rotate crops to reduce inoculum buildup.\n3. Avoid dense sowing rates.\n4. Use certified seed with low Septoria infection.",
    severity: "disease",
  },
  smut: {
    displayName: "Smut",
    shortDesc: "Tilletia / Ustilago spp.",
    description:
      "Smut diseases replace grain kernels with masses of dark fungal spores. Common Bunt (Tilletia caries) and Loose Smut (Ustilago nuda) are the primary forms. Seed-borne transmission is the primary infection pathway.",
    action: "Remove infected heads immediately. Treat seed before next planting.",
    solution:
      "1. Remove and destroy infected plants to prevent spore dispersal.\n2. Apply seed dressing (fungicide treatment) before planting in subsequent seasons.\n3. Use certified, tested, disease-free seed.\n4. Maintain proper crop rotation.",
    severity: "disease",
  },
  blast: {
    displayName: "Wheat Blast",
    shortDesc: "Magnaporthe oryzae",
    description:
      "Wheat blast caused by Magnaporthe oryzae Triticum pathotype causes bleaching of heads. Originally from South America, it has spread to Asia. Can cause 10–100% yield loss in severe outbreaks.",
    action: "Alert agricultural authorities immediately. This is a quarantine pathogen in many regions.",
    solution:
      "1. Report to plant health authorities — Wheat Blast is a regulated pathogen.\n2. Fungicide (trifloxystrobin) at heading can reduce severity.\n3. Avoid growing wheat in humid, warm conditions when possible.\n4. Use blast-resistant varieties where available.",
    severity: "disease",
  },
  "leaf blight": {
    displayName: "Leaf Blight",
    shortDesc: "Alternaria / Helminthosporium spp.",
    description:
      "Leaf blight presents as brown to tan lesions with darker borders on leaves. Caused by multiple fungal pathogens. Commonly observed in hot, dry conditions following humid periods.",
    action: "Apply foliar fungicide. Remove heavily infected plant material.",
    solution:
      "1. Apply broad-spectrum fungicide at early symptom stage.\n2. Avoid overhead irrigation that prolongs leaf wetness.\n3. Improve drainage in waterlogged areas.\n4. Use disease-free seed.",
    severity: "disease",
  },
  "common root rot": {
    displayName: "Common Root Rot",
    shortDesc: "Bipolaris sorokiniana",
    description:
      "Common root rot caused by Bipolaris sorokiniana produces brown discoloration of crown and root tissues. Affects plant water and nutrient uptake, causing stunting and premature senescence.",
    action: "Improve drainage and soil health. Consider fungicide seed treatment next season.",
    solution:
      "1. Improve soil drainage and avoid compaction.\n2. Apply seed treatment fungicide before planting.\n3. Rotate with non-cereal crops for at least two seasons.\n4. Maintain balanced soil fertility — avoid phosphorus deficiency.",
    severity: "warning",
  },
  "tan spot": {
    displayName: "Tan Spot",
    shortDesc: "Pyrenophora tritici-repentis",
    description:
      "Tan spot causes tan-colored lesions with a yellow chlorotic halo on wheat leaves. Spreads via infected crop residue. Can reduce yield by 10–40% in susceptible varieties under wet conditions.",
    action: "Apply fungicide and manage crop residue to reduce inoculum.",
    solution:
      "1. Apply triazole fungicide at first detection.\n2. Incorporate or remove crop residue after harvest.\n3. Use resistant varieties.\n4. Practice two-year crop rotation away from wheat.",
    severity: "warning",
  },
  aphid: {
    displayName: "Aphid Infestation",
    shortDesc: "Schizaphis graminum / Rhopalosiphum padi",
    description:
      "Wheat aphids are small soft-bodied insects that feed on plant sap. They cause direct damage through feeding and can transmit Barley Yellow Dwarf Virus (BYDV). Heavy infestations cause yellowing, stunting, and yield loss.",
    action: "Scout field for aphid density. Apply insecticide if above economic threshold.",
    solution:
      "1. Apply systemic insecticide (imidacloprid or lambda-cyhalothrin) when >10 aphids/tiller.\n2. Preserve natural enemies (ladybirds, parasitic wasps) — avoid broad-spectrum insecticide overuse.\n3. Monitor for BYDV symptoms (yellowing).\n4. Use aphid-resistant or tolerant varieties.",
    severity: "warning",
  },
  mite: {
    displayName: "Mite Infestation",
    shortDesc: "Aceria tosichella / Penthaleus major",
    description:
      "Wheat curl mites (Aceria tosichella) and blue oat mites (Penthaleus major) damage wheat by feeding on leaves, causing silvery streaks, curling, and transmitting Wheat Streak Mosaic Virus.",
    action: "Apply miticide if population exceeds threshold. Check for virus transmission symptoms.",
    solution:
      "1. Apply acaricide at early infestation detection.\n2. Destroy volunteer wheat and grass that serve as mite reservoirs.\n3. Delay planting to avoid peak mite emergence.\n4. Monitor for mosaic virus symptoms — there is no cure once infected.",
    severity: "warning",
  },
  "stem fly": {
    displayName: "Stem Fly",
    shortDesc: "Atherigona soccata / Meromyza spp.",
    description:
      "Stem fly larvae bore into wheat tillers, causing the central leaf to wilt and die (dead heart symptom). Damage is most severe during early crop stages. Can cause significant stand reduction if untreated.",
    action: "Apply insecticide seed treatment or foliar spray at crop emergence.",
    solution:
      "1. Apply carbofuran or chlorpyrifos seed treatment before planting.\n2. Apply foliar insecticide at early tillering if dead heart symptoms appear.\n3. Plant early to avoid peak fly emergence period.\n4. Avoid late sowing in high-risk areas.",
    severity: "warning",
  },
};

export const SEVERITY_CONFIG: Record<Severity, { label: string; color: string; bg: string; border: string }> = {
  healthy: {
    label: "Healthy",
    color: "text-emerald-400",
    bg: "bg-emerald-950/40",
    border: "border-emerald-800/50",
  },
  warning: {
    label: "Caution",
    color: "text-amber-400",
    bg: "bg-amber-950/40",
    border: "border-amber-800/50",
  },
  disease: {
    label: "Disease Detected",
    color: "text-red-400",
    bg: "bg-red-950/40",
    border: "border-red-800/50",
  },
};

export function getDiseaseInfo(predictedClass: string): DiseaseInfo {
  const key = predictedClass.toLowerCase().trim();
  return (
    DISEASE_KNOWLEDGE[key] ?? {
      displayName: predictedClass,
      shortDesc: "Classification result",
      description: "No additional details are available for this classification.",
      action: "Consult a local agricultural extension officer for guidance.",
      solution: "Seek professional agricultural advice for treatment options.",
      severity: "warning",
    }
  );
}
