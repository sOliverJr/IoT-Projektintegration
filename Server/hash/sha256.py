import hashlib


def hash_sha256_string(string):
    """Hashes the string"""
    h = hashlib.sha256()
    string = string.encode('UTF-8')
    h.update(string)
    return h.hexdigest()
