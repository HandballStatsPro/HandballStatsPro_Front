#!/usr/bin/env python3
"""
Frontend Test for Handball Action Registration App
Tests the React application running on localhost:5173
"""

import requests
import json
import sys
from datetime import datetime

class HandballAppTester:
    def __init__(self, base_url="http://localhost:5173"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0

    def run_test(self, name, test_func):
        """Run a single test"""
        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        
        try:
            result = test_func()
            if result:
                self.tests_passed += 1
                print(f"✅ Passed")
            else:
                print(f"❌ Failed")
            return result
        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False

    def test_app_accessibility(self):
        """Test if the app is accessible"""
        try:
            response = requests.get(self.base_url, timeout=5)
            return response.status_code == 200 and "HandballStats" in response.text
        except:
            return False

    def test_html_structure(self):
        """Test if HTML contains expected elements"""
        try:
            response = requests.get(self.base_url, timeout=5)
            html = response.text
            
            # Check for essential elements
            checks = [
                '<div id="root">' in html,
                'HandballStats Pro' in html,
                'main.jsx' in html
            ]
            
            return all(checks)
        except:
            return False

    def test_static_assets(self):
        """Test if static assets are accessible"""
        try:
            # Test favicon
            favicon_response = requests.get(f"{self.base_url}/vite.svg", timeout=5)
            return favicon_response.status_code == 200
        except:
            return False

    def print_summary(self):
        """Print test summary"""
        print(f"\n📊 FRONTEND TEST SUMMARY")
        print(f"Tests passed: {self.tests_passed}/{self.tests_run}")
        print(f"Success rate: {(self.tests_passed/self.tests_run)*100:.1f}%")
        
        if self.tests_passed == self.tests_run:
            print("🎉 All frontend accessibility tests passed!")
            return True
        else:
            print("⚠️ Some frontend tests failed")
            return False

def main():
    print("=== HANDBALL ACTION REGISTRATION APP - FRONTEND TESTS ===")
    
    tester = HandballAppTester()
    
    # Run basic accessibility tests
    tester.run_test("App Accessibility", tester.test_app_accessibility)
    tester.run_test("HTML Structure", tester.test_html_structure)
    tester.run_test("Static Assets", tester.test_static_assets)
    
    # Print results
    success = tester.print_summary()
    
    if success:
        print("\n✅ Frontend is ready for browser automation testing")
        print("🔗 App URL: http://localhost:5173")
        print("📋 Ready to test: Match Data Form, Action Registration, Validation System")
    else:
        print("\n❌ Frontend has issues that need to be resolved first")
    
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())