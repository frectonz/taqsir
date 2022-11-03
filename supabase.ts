export class SupabaseClient {
  private supabaseUrl: string;
  private supabaseKey: string;
  constructor(supabaseUrl: string, supabaseKey: string) {
    this.supabaseUrl = supabaseUrl;
    this.supabaseKey = supabaseKey;
  }

  table(table: string) {
    return new SupabaseTable(this.supabaseUrl, this.supabaseKey, table);
  }
}

class SupabaseTable {
  private table: string;
  private supabaseUrl: string;
  private supabaseKey: string;

  constructor(supabaseUrl: string, supabaseKey: string, table: string) {
    this.table = table;
    this.supabaseUrl = supabaseUrl;
    this.supabaseKey = supabaseKey;
  }

  async get(id: string) {
    const response = await fetch(
      `${this.supabaseUrl}/rest/v1/${this.table}?id=eq.${id}`,
      {
        headers: {
          "apikey": this.supabaseKey,
          "Content-Type": "application/json",
        },
      },
    );
    const data = await response.json();
    return data[0];
  }

  async getBySuffix(suffix: string) {
    const response = await fetch(
      `${this.supabaseUrl}/rest/v1/${this.table}?suffix=eq.${suffix}`,
      {
        headers: {
          "apikey": this.supabaseKey,
          "Content-Type": "application/json",
        },
      },
    );
    const data = await response.json();
    return data[0];
  }

  async update(id: string, data: Record<string, unknown>) {
    const response = await fetch(
      `${this.supabaseUrl}/rest/v1/${this.table}?id=eq.${id}`,
      {
        method: "PATCH",
        headers: {
          "apikey": this.supabaseKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      },
    );
    return await response.text();
  }

  async insert(data: Record<string, unknown>) {
    await fetch(
      `${this.supabaseUrl}/rest/v1/${this.table}`,
      {
        method: "POST",
        headers: {
          "apikey": this.supabaseKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      },
    );
  }
}

