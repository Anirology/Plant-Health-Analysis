def build_plant_prompt(plant_name: str, plant_type: str, location: str, symptoms: str) -> str:
    """Build the Gemini prompt. This is ready to use when Gemini is configured."""
    location_text = location or "Not provided"
    return f"""You are helping with basic plant care.

Plant name: {plant_name}
Plant type: {plant_type}
Location: {location_text}
Symptoms: {symptoms}

Give a short educational plant health analysis. Include:
1. Possible issue
2. Short explanation
3. Three simple care suggestions
4. When expert agricultural advice may be needed

Do not claim the result is a guaranteed diagnosis. Be educational and cautious."""


def analyze_plant(plant_name: str, plant_type: str, location: str, symptoms: str) -> str:
    """Temporary response until the Google Gemini call is added here."""
    # Future Gemini integration:
    # prompt = build_plant_prompt(plant_name, plant_type, location, symptoms)
    # response = gemini_model.generate_content(prompt)
    # return response.text
    location_note = f" in {location}" if location else ""
    return (
        "Possible issue: The symptoms may be linked to watering, nutrition, light, "
        "or pest-related stress.\n\n"
        f"Short explanation: {plant_name} is a {plant_type} plant{location_note}. "
        "Several common conditions can create similar visible changes, so check the plant and its growing conditions before treating it.\n\n"
        "Care suggestion 1: Check soil moisture before watering and make sure excess water can drain.\n"
        "Care suggestion 2: Inspect both sides of leaves and stems for insects, webbing, or unusual marks.\n"
        "Care suggestion 3: Review light exposure and use a suitable balanced fertilizer only if the plant is due for feeding.\n\n"
        "When to seek expert advice: Contact a local agricultural adviser if symptoms spread quickly, affect many plants, or continue after basic care changes."
    )
