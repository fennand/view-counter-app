import { sql } from "@vercel/postgres";

export default async function Home() {
  let time = await fetch("http://worldtimeapi.org/api/timezone/Europe/London", {
    next: { revalidate: 10 },
  });
  const data = await time.json();

  const datetime = new Date(data.datetime);
  const evenEasierToReadDate = datetime.toLocaleTimeString("en-GB");
  console.log(data);

  await sql`INSERT INTO ViewsTable (views) SELECT 0 WHERE NOT EXISTS (SELECT * FROM ViewsTable)`;
  await sql`UPDATE ViewsTable SET views = views + 1`;
  const result = await sql`SELECT Views FROM ViewsTable`;

  console.log(result);

  return (
    <main className="flex min-h-screen flex-col items-center">
      <p>You&apos;re looking at my root route. Roude!</p>
      <p>This has been viewed {result.rows[0].views}</p>
      <p>The time is : {evenEasierToReadDate}</p>
    </main>
  );
}
