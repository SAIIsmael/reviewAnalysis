import re
import sys
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.firefox.firefox_binary import FirefoxBinary

firefox_dev_binary = FirefoxBinary(r'/Applications/Firefox Developer Edition.app/Contents/MacOS/firefox-bin')
driver = webdriver.Firefox(firefox_binary=firefox_dev_binary, executable_path="geckodriver")
driver.get("https://www.cis.uni-muenchen.de/~schmid/tools/TreeTagger/")

elements = driver.find_elements_by_tag_name("p")

for element in elements :
    print(element.text)
