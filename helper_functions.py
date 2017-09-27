def punct_space(token):
    """
    helper function to eliminate tokens
    that are pure punctuation or whitespace
    """
    
    return token.is_punct or token.is_space

def line_speech(filename):
    """
    generator function to read in speeches from the file
    and un-escape the original line breaks in the text
    """
    
    with codecs.open(filename, encoding='utf_8') as f:
        for speech in f:
            yield speech.replace('\\n', '\n')

def lemmatized_sentence_corpus(filename):
    """
    generator function to use spaCy to parse speeches,
    lemmatize the text, and yield sentences
    """
    
    for parsed_speech in nlp.pipe(line_speech(filename),
                                  batch_size=10000, n_threads=4):
        
        for sent in parsed_speech.sents:
            yield u' '.join([token.lemma_ for token in sent
                             if not punct_space(token)])