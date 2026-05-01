import HomeContent from "./HomeContent";
import { getPublishedPosts } from "@/lib/notion";

export const revalidate = 60;

export default async function Page() {
  const posts = await getPublishedPosts();
  return <HomeContent posts={posts} />;
}
