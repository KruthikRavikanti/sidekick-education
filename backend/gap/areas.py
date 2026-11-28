"""The area of a grade that a catalog skill belongs to, in a parent's words.

The skill map files skills under Common Core domains. Parents see those as a handful of
plain areas ("Fractions", "Reading stories"), which is how the parent portal groups its dots.
"""

AREAS = {
    'Counting & Cardinality': 'Counting',
    'Operations & Algebraic Thinking': 'Operations and algebra',
    'Number & Operations in Base Ten': 'Place value',
    'Number & Operations: Fractions': 'Fractions',
    'Measurement & Data': 'Measurement and data',
    'Geometry': 'Geometry',
    'Ratios & Proportional Relationships': 'Ratios',
    'The Number System': 'Number system',
    'Expressions & Equations': 'Expressions and equations',
    'Statistics & Probability': 'Statistics',
    'Language': 'Language',
    'Writing': 'Writing',
    'Speaking & Listening': 'Speaking and listening',
    'Reading: Literature': 'Reading stories',
    'Reading: Informational Text': 'Reading for information',
    'Reading: Foundational Skills': 'Reading foundations',
}

# A few Georgia-only skills carry no Common Core domain. Their code names the strand.
GEORGIA_STRANDS = {
    'NR': 'Place value',
    'PAR': 'Operations and algebra',
    'MDR': 'Measurement and data',
    'GSR': 'Geometry',
}


def area_for(raw, subskill_id='', subject=''):
    """A short parent-facing area name for one catalog row. Never empty."""
    domain = str((raw or {}).get('domain') or '').strip()
    if domain in AREAS:
        return AREAS[domain]
    if domain:
        return domain.replace(' & ', ' and ').replace(': ', ' ')
    parts = str(subskill_id or '').split('-')
    if len(parts) >= 3 and parts[0] == 'GA':
        strand = parts[2].split('.')[0]
        if strand in GEORGIA_STRANDS:
            return 'Counting' if strand == 'NR' and parts[1] == 'K' else GEORGIA_STRANDS[strand]
    return 'More math' if str(subject).casefold() == 'math' else 'More reading and writing'
