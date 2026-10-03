// Forwards contact form posts to the chronopax-contact Worker (service binding CONTACT).
export const onRequestPost = ({ request, env }) => env.CONTACT.fetch(request);
