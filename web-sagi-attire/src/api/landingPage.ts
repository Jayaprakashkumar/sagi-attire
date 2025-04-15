import { CONTENTFUL_ACCESS_TOKEN, CONTENTFUL_URL } from "./contentful";

const categoryAndImageQuery = () => `{
    landingPageCollection {
      items {
        categoriesCollection {
          items {
            title 
            content {
              url
            }
            category {
              id
            }
          }
        }
        imageSliderCollection {
          items {
            category {
              id
            }
            content {
              json
            }
            mediaCollection {
              items {
                url
              }
            }
          }
        }
      }
    }
  }`;

const newArrivalŒuery = () => `{
  landingPageCollection {
    items {
     newArrivalCollection{
      items{
        id
        sys{
          id
        }
        name
        price
        offerInPercentage
        description{
          json
        }
        category{
          id
        }

        imagesCollection{
          items{
            url
          }
        }
        
      }
    }
    }
  }
}`;

export const getNewArrivals = async () => {
  const query = newArrivalŒuery();

  const response = await fetch(CONTENTFUL_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: CONTENTFUL_ACCESS_TOKEN,
    },
    body: JSON.stringify({ query }),
  })
    .then((response) => response.json())
    .catch((error) => console.log(error));

  return response;
};

export const getLandingPage = async () => {
  const query = categoryAndImageQuery();

  const response = await fetch(CONTENTFUL_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: CONTENTFUL_ACCESS_TOKEN,
    },
    body: JSON.stringify({ query }),
  })
    .then((response) => response.json())
    .catch((error) => console.log(error));

  return response;
};
