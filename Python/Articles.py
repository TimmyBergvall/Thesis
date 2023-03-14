# python -m pip install requests
import requests
# pip install beautifulsoup4
from bs4 import BeautifulSoup

#import nltk
#nltk.download('punkt')
#pip intsll numpy
# pip install sumy
from sumy.parsers.plaintext import PlaintextParser
from sumy.nlp.tokenizers import Tokenizer
from sumy.summarizers.text_rank import TextRankSummarizer



# pip install firebase-admin
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

# Use a service account.
#cred = credentials.Certificate('C:\\Users\\vigge\\OneDrive\\Dokument\\GitHub\\Thesis\\Python\\thesis-d3405-firebase-adminsdk-rhutc-f3e32f581c.json')
cred = credentials.Certificate('C:\\Users\\Timmy\\Documents\\GitHub\\Thesis\\Python\\thesis-d3405-firebase-adminsdk-rhutc-f3e32f581c.json')

app = firebase_admin.initialize_app(cred)

db = firestore.client()





# Attributes that should be collected from the website
landing_page = ""
link_class = ""
start_link_for_article = ""
li_or_a = ""
div_or_p_lead = ""
div_or_p_body = ""
lead_class = ""
body_class = ""
header_class = ""


list = []

headerDict = {}

articleDict = {}

summarizedDict = {}

linkDict = {}

website = "expressen"

def main():
    set_variables()
    get_links()
    print_articles(website)

def set_variables():
    # This data will be fetched from a database in the future
    global landing_page, link_class, start_link_for_article, li_or_a, div_or_p_lead, div_or_p_body, lead_class, body_class, header_class
    if website == "aftonbladet":
        landing_page = "https://www.aftonbladet.se/senastenytt"
        link_class = "hyperion-css-1ypiqmx"
        start_link_for_article = "https://www.aftonbladet.se"
        li_or_a = "a"
        div_or_p_lead = "p"
        div_or_p_body = "p"
        lead_class = "hyperion-css-n38mho"
        body_class = "borderColor borderWidth margin padding mqDark hyperion-css-1nrt0vq"
        header_class = "h1 hyperion-css-5tht1q"

    elif website == "expressen":
        landing_page = "https://www.expressen.se/nyheter/senaste-nytt/"
        link_class = "page-list__item"
        start_link_for_article = "https://www.expressen.se/"
        li_or_a = "li"
        div_or_p_lead = "div"
        div_or_p_body = "div"
        lead_class = "article__preamble rich-text"
        body_class = "rich-text"
        header_class = ""


    elif website == "svt":
        landing_page = "https://www.svt.se/?visaallasenastenytt=1#senastenytt"
        link_class = "nyh_latest-news-item__link"
        start_link_for_article = "https://www.svt.se"
        li_or_a = "a"
        div_or_p_lead = "div"
        div_or_p_body = "div"
        lead_class = "nyh_article__lead"
        body_class = "nyh_article-body"
        header_class = "nyh_article__heading"



def get_links():
    # Make a request to the website
    r = requests.get(landing_page)
    # Parse the HTML content
    soup = BeautifulSoup(r.content, 'html.parser')
    # Find first 10 links on the page
    links = soup.find_all(li_or_a, attrs={"class": link_class})[:20]

    counter = 0
    articleCounter = 0
    while articleDict.__len__() < 10:
        for link in links:
            if articleDict.__len__() == 10:
                break
            counter += 1
            articleCounter += 1
            get_article(link, counter, articleCounter)
            
        

def get_article(link, counter, articleCounter):
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

    # Find all divs on the page
    if (header_class != ""):
        header = soup.find_all("h1", attrs={"class": header_class})
    else:
        header = soup.find_all("h1")
        
    
    


    lead = soup.find_all(div_or_p_lead, attrs={"class": lead_class})
    body = soup.find_all(div_or_p_body, attrs={"class": body_class})

   


    # Add the header of the article
    append = ""
    for header in header:
        the_header = '"' + header.get_text() + '"'
        the_header = the_header.replace("\n", " ")
        headerDict[articleCounter] = the_header
        #append += the_header + "\n"


    # add the lead of the article
    for lead in lead:
        the_lead = lead.get_text()
        append += the_lead

    
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

    # add the complete articles to the list
    if (append != ""):
        articleDict[counter] = append
        list.append(append)
        ml(append, counter)

def print_articles(website):
    
    for i in summarizedDict:
        print(i)
        print(linkDict[i])
        print(headerDict[i])
        print(summarizedDict[i])
        print("\n\n\n")

       






    #for i in myDict:
        #print(myDict[i])
    #for articles in list:
        #print(articles)
        #print("\n\n\n")

    #print(myDict) 

    #print(articleDict[1])
    print("")
    


def ml(append, counter):
    parser = PlaintextParser.from_string(append, Tokenizer("swedish"))

    summarizer = TextRankSummarizer()
    summary = summarizer(parser.document, 1)  # Summarize the document with 3 sentences

    # Print the summary
    for sentence in summary:
        sentence = str(sentence).replace(".", ". ")
        summarizedDict[counter] = sentence
        #print("article ", counter, "\n\n", sentence, "\n\n")

    #print(summarizedDict)

if __name__ == "__main__":
    main()