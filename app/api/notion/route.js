export async function GET(req) {
    try {
        const response = await fetch(`https://api.notion.com/v1/databases/${process.env.NOTION_DATABASE_ID}/query`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.NOTION_API_KEY}`,
                'Content-Type': 'application/json',
                'Notion-Version': '2022-06-28'
            }
        });

        if (!response.ok) {
            return new Response(JSON.stringify({ error: `Notion API error: ${response.status}` }), { status: response.status });
        }

        const data = await response.json();
        console.log("Notion API Response:", data);
        
        return new Response(JSON.stringify(data), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to fetch data' }), { status: 500 });
    }
}
