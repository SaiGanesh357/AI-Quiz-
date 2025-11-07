import requests
from bs4 import BeautifulSoup

def extract_wikipedia_text(url: str):
    try:
        headers = {
            "User-Agent": (
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/124.0.0.0 Safari/537.36"
            )
        }

        # Fetch the HTML content with a browser header
        response = requests.get(url, headers=headers, timeout=15)
        response.raise_for_status()

        soup = BeautifulSoup(response.text, "html.parser")

        # Extract title
        title = soup.find("h1", {"id": "firstHeading"})
        title_text = title.text.strip() if title else "Untitled"

        # Extract main content paragraphs
        content_div = soup.find("div", {"id": "mw-content-text"})
        if not content_div:
            return title_text, ""

        paragraphs = content_div.find_all("p")
        content = "\n".join(p.get_text() for p in paragraphs)

        # Clean the text
        content = (
            content.replace("\n", " ")
            .replace("[edit]", "")
            .replace("[citation needed]", "")
            .replace("[", "")
            .replace("]", "")
        )

        print(f"✅ Successfully scraped {len(content)} characters from {url}")
        return title_text, content

    except Exception as e:
        print(f"❌ Error scraping Wikipedia: {e}")
        return "", ""
