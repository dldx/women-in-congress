# Dictionary of topic names
topic_names_100 = {
    0: "business",
    3: "immigration",
    4: "counter terrorism",
    5: "syria",
    6: "private housing",
    7: "banking",
    9: "tribunal",
    18: "bbc",
    19: "police force",
    20: "parliamentary terms",
    21: "secretary of state terms",
    23: "local authority",
    25: "domestic violence",
    26: "airport and rail expansion",
    27: "scotland",
    29: "parliamentary terms+",
    30: "wales",
    32: "drugs and alcohol",
    33: "middle east",
    35: "care quality commission",
    36: "speaker of the house",
    39: "nhs",
    41: "farming",
    42: "law",
    43: "development & climate change",
    44: "fishing industry",
    45: "inquiries & reports",
    46: "northern ireland",
    47: "construction",
    49: "animal welfare",
    60: "fraud terminology",
    62: "legislation",
    63: "bill terminology",
    64: "regional stuff",
    65: "elections",
    68: "local services",
    69: "energy",
    70: "welfare reforms",
    71: "european union",
    72: "education",
    73: "money-related terms",
    74: "pensioner income",
    76: "child poverty",
    78: "sports & culture",
    79: "investment",
    84: "armed forces",
    85: "economy",
    86: "house of lords",
    87: "employee's rights",
    92: "nuclear weapons",
    95: "parliamentary terms++",
    99: "child care"
}

def topic_dict(topic_number):
    """
    return name of topic where identified
    """
    
    try:
        return topic_names_100[topic_number]
    except KeyError:
        return topic_number