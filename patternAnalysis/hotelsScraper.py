import re
import sys
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.firefox.firefox_binary import FirefoxBinary

if len(sys.argv) < 2:
    print("Error.\nUsage: python3 hotelScraper.py url-from-hotels.com city_scrapped")
    sys.exit(1)


listURL = []

firefox_dev_binary = FirefoxBinary(r'/Applications/Firefox Developer Edition.app/Contents/MacOS/firefox-bin')
driver = webdriver.Firefox(firefox_binary=firefox_dev_binary, executable_path="geckodriver")
driver.get(sys.argv[1])

allLinks = driver.find_elements_by_xpath('//a[@class="guest-reviews-link reviews-link"]')
for links in allLinks:
    listURL.append(links.get_attribute("href"))

i = 0
f = open("./csv/"+sys.argv[2]+".csv", "w")

f.write("avis$text\n")

for url in listURL:
	driver.get(url)
	avis = driver.find_elements_by_xpath('//blockquote[@class="expandable-content description"]')
	for reviews in avis:
		tmp = re.sub('\n',' ',reviews.text )
		f.write("avis " + str(i) +'$')
		f.write(tmp)
		f.write("\n")
		i=i+1

f.close()
driver.quit()
