/**
 * Linking Agent (Mock/Simple)
 * In a full project, this would scan the DB for relevant internal articles to link to.
 */
export async function linkingAgent({ content, keywords }: { content: string; keywords: string[] }) {
  // Simulating internal link injection for now
  let finalContent = content;
  
  if (keywords.length > 0) {
    const mainKw = keywords[0];
    const link = `<a href="/articles/search?q=${encodeURIComponent(mainKw)}">${mainKw}</a>`;
    finalContent = finalContent.replace(new RegExp(mainKw, 'i'), link);
  }

  return { content: finalContent };
}
