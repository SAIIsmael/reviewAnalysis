import re
import sys
import time
import getpass
from texttable import Texttable
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.firefox.firefox_binary import FirefoxBinary

if len(sys.argv) < 2:
    print("Error! Usage: python3 parser.py phrase")
    sys.exit(1)

phrase = sys.argv[1]

firefox_dev_binary = FirefoxBinary(r'/Applications/Firefox Developer Edition.app/Contents/MacOS/firefox-bin')
driver = webdriver.Firefox(firefox_binary=firefox_dev_binary, executable_path="geckodriver")
driver.get("http://alpage.inria.fr/frmgwiki/wiki/lanalyseur-syntaxique-frmg-pour-le-fran%C3%A7ais")
driver.find_element_by_xpath("//textarea[@class='parser-mf-st-input']").send_keys(phrase)
driver.find_element_by_xpath("//select[@class='parser-mf-option-format']").click()
driver.find_element_by_xpath("//option[@value='passage']").click()
driver.find_element_by_xpath("//input[@class='parser-mf-submit']").click()
time.sleep(3)
driver.find_element_by_xpath("//div[@title='export']").click()
driver.find_element_by_xpath("//input[@value='Export']").click()

time.sleep(1)

driver.switch_to_window(driver.window_handles[-1])
json = driver.find_element_by_xpath("//pre")

f = open("graph.json", "w")
regex = r".*],\"chunks\""

matches = re.finditer(regex, json.text, re.MULTILINE)

for matchNum, match in enumerate(matches, start=1):
    find = match.group()

f.write(re.sub(',\"chunks\"', '}}', find))

f.close()
driver.quit()




