import { createClient } from "contentful";

export const SPACE_ID = "d0d5phff6j8d";
export const ACCESS_TOKEN = "Uz8wff-Ew2tq58ADfxCwLGmfsVsFj7GCPl0ygcS94z0";

const client = createClient({
  space: SPACE_ID,
  accessToken: ACCESS_TOKEN,
});

export default client;
