import sys
import os
import traceback

# Add project root to path
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

def run_diagnostics():
    print("="*60)
    print("DIAGNOSTIC CHECK")
    print("="*60)
    
    errors = []

    # 1. Check Imports
    print("\n1. Checking Core Imports...")
    modules = [
        'src.data.loader',
        'src.data.preprocess',
        'src.models.baseline',
        'src.models.nlp',
        'src.models.url_cnn',
        'src.features.nlp_advanced',
        'src.features.llm_gemini',
        'src.api.routes',
        'src.api.main'
    ]
    
    for mod in modules:
        try:
            __import__(mod)
            print(f"  [OK] {mod}")
        except Exception as e:
            print(f"  [FAIL] {mod}: {e}")
            errors.append(f"ImportError in {mod}: {e}")

    # 2. Check Directory Structure
    print("\n2. Checking Directory Structure...")
    required_dirs = [
        'src', 'src/data', 'src/models', 'src/features', 'src/api',
        'dashboard', 'extension'
    ]
    for d in required_dirs:
        if os.path.isdir(d):
            print(f"  [OK] {d}/")
        else:
            print(f"  [MISSING] {d}/")
            errors.append(f"Missing directory: {d}")

    # 3. Check Environment
    print("\n3. Checking Environment...")
    if os.path.exists('.env'):
        print("  [OK] .env file exists")
    else:
        print("  [WARN] .env file missing")
        # Not a critical error for code correctness, but runtime issue

    if not errors:
        print("\n" + "="*60)
        print("✅ NO CRITICAL CODE ERRORS FOUND")
        print("="*60)
        sys.exit(0)
    else:
        print("\n" + "="*60)
        print(f"❌ FOUND {len(errors)} ERRORS")
        print("="*60)
        for e in errors:
            print(f"- {e}")
        sys.exit(1)

if __name__ == "__main__":
    run_diagnostics()
