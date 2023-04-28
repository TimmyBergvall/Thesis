# python -m pip install requests
import requests
# pip install beautifulsoup4
from bs4 import BeautifulSoup

# pip install torch
# pip install bert-extractive-summarizer
from summarizer import Summarizer

# pip install firebase-admin
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

# Use a service account.
# cred = credentials.Certificate('C:\\Users\\vigge\\OneDrive\\Dokument\\GitHub\\Thesis\\Python\\thesis-d3405-firebase-adminsdk-rhutc-f3e32f581c.json')
cred = credentials.Certificate('C:\\Users\\Timmy\\Documents\\GitHub\\Thesis\\Python\\thesis-d3405-firebase-adminsdk-rhutc-f3e32f581c.json')

app = firebase_admin.initialize_app(cred)

db = firestore.client()

# Attributes that show the structure of the news page
landing_page = ""
link_class = ""
start_link_for_article = ""
li_or_a = ""
div_or_p_lead = ""
div_or_p_body = ""
lead_class = ""
body_class = ""
header_class = ""
counter = 0

headerDict = {}
articleDict = {}
summarizedDict = {}
linkDict = {}


def main():
    global counter
    docs = db.collection('website').get()

    for doc in docs:
        print("Starting with " + doc.id)
        counter = 0
        set_variables(doc.id)
        get_links()
        add_to_db(doc.id)
        print("Done with " + doc.id)


def set_variables(doc_id):
    global landing_page, link_class, start_link_for_article, li_or_a, div_or_p_lead, div_or_p_body, lead_class, body_class, header_class

    doc = db.collection('website').document(doc_id).get()

    # set variables to the values from the database
    landing_page = doc.get("landing_page")
    link_class = doc.get("link_class")
    start_link_for_article = doc.get("start_link_for_article")
    li_or_a = doc.get("li_or_a")
    div_or_p_lead = doc.get("div_or_p_lead")
    div_or_p_body = doc.get("div_or_p_body")
    lead_class = doc.get("lead_class")
    body_class = doc.get("body_class")
    header_class = doc.get("header_class")


def get_links():
    # Make a request to the website
    requestPage = requests.get(landing_page)
    # Parse the HTML content
    soup = BeautifulSoup(requestPage.content, "html.parser")
    # Find first 15 links on the page
    links = soup.find_all(li_or_a, attrs={"class": link_class})[:15]
    
    while summarizedDict.__len__() < 10:
        for link in links:
            if articleDict.__len__() == 10:
                break
            get_article(link)


def get_article(link):
    global counter
    print("Getting article " + str(summarizedDict.__len__()))
    # Get the link to the article
    if li_or_a == "li":
        if ("https://" in link.find("a").get("href")):
            myLinks = link.find("a").get("href")
            linkDict[counter] = myLinks
        else:
            myLinks = start_link_for_article + link.find("a").get("href")
            linkDict[counter] = myLinks
    else:
        if ("https://" in link.get("href")):
            myLinks = link.get("href")
            linkDict[counter] = myLinks
        else:
            myLinks = start_link_for_article + link.get("href")
            linkDict[counter] = myLinks

    # Make a request to the website
    req = requests.get(myLinks)
    # Parse the HTML content
    soup = BeautifulSoup(req.content, 'html.parser')

    if (header_class != ""):
        header = soup.find_all("h1", attrs={"class": header_class})
    else:
        header = soup.find_all("h1")

        
    # Add the header of the article
    append = ""
    for header in header:
        the_header = '"' + header.get_text() + '"'
        the_header = the_header.replace("\n", " ")
        headerDict[counter] = the_header

    lead = soup.find_all(div_or_p_lead, attrs={"class": lead_class})
    # add the lead of the article
    for lead in lead:
        the_lead = lead.get_text()
        append += the_lead

    body = soup.find_all(div_or_p_body, attrs={"class": body_class})
    # add the body of the article
    the_body = ""
    if div_or_p_body == "div":
        for div in body:
            p_in_div = div.find_all("p")
            if (p_in_div != []):
                for body in p_in_div:
                    body_content = body.get_text()
                    the_body += body_content
    else:
        for body in body:
            body_content = body.get_text()
            the_body += body_content
    append += the_body

    if (header == []):
        append = ""

    # add the article to the dictionary
    if (append != ""):
        articleDict[counter] = append
        mlSummarizer()
        counter += 1


def mlSummarizer():
    global counter
    # error handler to not print warnings
    import logging
    logging.getLogger("transformers.modeling_utils").setLevel(logging.ERROR)
    import warnings
    warnings.filterwarnings("ignore")

    model = Summarizer()

    summarizedArticle = model(articleDict[counter], num_sentences=3)

    summarizedDict[counter] = summarizedArticle


def add_to_db(website):
    for i in summarizedDict:
        # define objct (each article)
        source_ref = db.collection(u'Sources').document(website)
        source_ref.set({
            u'name': website
        })

        article_ref = source_ref.collection(
            u'Articles').document('Article' + str(i))
        article_ref.set({
            u'header': headerDict[i],
            u'link': linkDict[i],
            u'text': summarizedDict[i],
            u'source': website
        })

    # Clear dictionaries
    headerDict.clear()
    articleDict.clear()
    summarizedDict.clear()
    linkDict.clear()

if __name__ == "__main__":
    main()
