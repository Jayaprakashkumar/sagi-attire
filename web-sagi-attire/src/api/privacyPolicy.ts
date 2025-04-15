import { CONTENTFUL_ACCESS_TOKEN, CONTENTFUL_URL } from "./contentful";

const privacyPolicyQuery = () => `{
  privacyPolicyCollection {
    items {
      id
      content {
        json
      }
    }
  }
}`;

export const getPrivacyPolicy = async () => {
  const query = privacyPolicyQuery();

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
