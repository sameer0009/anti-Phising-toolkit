"""
Anti-Phishing Toolkit - Main Entry Point
Run this script to start the complete platform locally for testing.
"""
import subprocess
import sys
import os
from pathlib import Path

def check_dependencies():
    """Check if required dependencies are installed."""
    print("Checking dependencies...")
    try:
        import fastapi
        import uvicorn
        import transformers
        print("Backend dependencies OK")
    except ImportError as e:
        print(f"Missing dependency: {e}")
        print("Installing dependencies...")
        subprocess.run([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])

def start_api():
    """Start the FastAPI backend."""
    print("\nStarting FastAPI Backend on http://localhost:8000")
    return subprocess.Popen(
        [sys.executable, "-m", "uvicorn", "src.api.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"],
        cwd=Path(__file__).parent
    )

def start_dashboard():
    """Start the Next.js dashboard."""
    print("\nStarting Next.js Dashboard on http://localhost:3000")
    dashboard_path = Path(__file__).parent / "dashboard"
    
    # Check if node_modules exists
    if not (dashboard_path / "node_modules").exists():
        print("Installing dashboard dependencies...")
        subprocess.run(["npm", "install"], cwd=dashboard_path, shell=True)
    
    return subprocess.Popen(
        ["npm", "run", "dev"],
        cwd=dashboard_path,
        shell=True
    )

def main():
    print("=" * 60)
    print("ANTI-PHISHING TOOLKIT - ENTERPRISE PLATFORM")
    print("=" * 60)
    
    # Check environment
    if not os.path.exists(".env"):
        print("\nWarning: .env file not found!")
        print("Creating from .env.example...")
        if os.path.exists(".env.example"):
            import shutil
            shutil.copy(".env.example", ".env")
            print("Created .env - Please add your GEMINI_API_KEY")
    
    check_dependencies()
    
    try:
        api_process = start_api()
        print("\nWaiting for API to initialize...")
        import time
        time.sleep(3)
        
        # Uncomment to auto-start dashboard
        # dashboard_process = start_dashboard()
        
        print("\n" + "=" * 60)
        print("PLATFORM RUNNING")
        print("=" * 60)
        print("API Documentation: http://localhost:8000/docs")
        print("Health Check: http://localhost:8000/health")
        print("Dashboard: http://localhost:3000 (run manually: cd dashboard && npm run dev)")
        print("\nPress Ctrl+C to stop...")
        print("=" * 60 + "\n")
        
        api_process.wait()
        
    except KeyboardInterrupt:
        print("\n\nShutting down...")
        api_process.terminate()
        # if 'dashboard_process' in locals():
        #     dashboard_process.terminate()
        print("Platform stopped")

if __name__ == "__main__":
    main()
