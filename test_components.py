"""
Quick test script to verify the API works
"""
import sys
import os

# Add src to path
sys.path.insert(0, os.path.dirname(__file__))

print("Testing Anti-Phishing Toolkit Components...")
print("=" * 60)

# Test 1: Import core modules
print("\n1. Testing imports...")
try:
    from src.data.preprocess import Preprocessor
    print("   ✓ Preprocessor imported")
except Exception as e:
    print(f"   ✗ Preprocessor failed: {e}")

try:
    from src.models.baseline import BaselineModel
    print("   ✓ BaselineModel imported")
except Exception as e:
    print(f"   ✗ BaselineModel failed: {e}")

# Test 2: Test preprocessor
print("\n2. Testing Preprocessor...")
try:
    prep = Preprocessor()
    test_text = "URGENT: Click here to verify your account NOW!"
    clean = prep.clean_text(test_text)
    cta = prep.extract_cta_features(test_text)
    print(f"   ✓ Text cleaned: '{clean[:50]}...'")
    print(f"   ✓ CTA detected: {cta}")
except Exception as e:
    print(f"   ✗ Preprocessor test failed: {e}")

# Test 3: Test URL features
print("\n3. Testing URL Analysis...")
try:
    test_url = "http://192.168.1.1/login.php"
    features = prep.extract_lexical_features(test_url)
    print(f"   ✓ URL features extracted: {features}")
except Exception as e:
    print(f"   ✗ URL analysis failed: {e}")

# Test 4: Test API routes (without running server)
print("\n4. Testing API Routes...")
try:
    from src.api.routes import router
    print(f"   ✓ API Router loaded with {len(router.routes)} routes")
    for route in router.routes:
        print(f"      - {route.methods} {route.path}")
except Exception as e:
    print(f"   ✗ API routes failed: {e}")

print("\n" + "=" * 60)
print("Basic component tests complete!")
print("\nTo start the full platform:")
print("  python run.py")
print("\nOr use Docker:")
print("  docker-compose up --build")
