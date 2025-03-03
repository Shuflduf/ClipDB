import { Client, Storage, Databases, ID, Query } from "appwrite";
import type { Models } from "appwrite";
import { PROJECT_ID } from "../constants";

class AppwriteService {
  private client: Client;
  private storage: Storage;
  private databases: Databases;

  constructor() {
    this.client = new Client()
      .setEndpoint("https://cloud.appwrite.io/v1")
      .setProject(PROJECT_ID);

    this.storage = new Storage(this.client);
    this.databases = new Databases(this.client);
  }

  async listFiles(): Promise<Models.File[]> {
    const result = await this.storage.listFiles("main", [Query.limit(100)]);
    console.log(result.files);
    return result.files;
  }

  async uploadFile(file: File): Promise<Models.File> {
    return await this.storage.createFile("main", ID.unique(), file);
  }

  getFileUrl(fileId: string): string {
    return `https://cloud.appwrite.io/v1/storage/buckets/main/files/${fileId}/view?project=${PROJECT_ID}`;
  }

  async addMetadata(fileId: string, creator: string): Promise<Models.Document> {
    return await this.databases.createDocument("main", "metadata", fileId, {
      creator: creator.trim().length > 0 ? creator.trim() : "Anonymous",
    });
  }

  async getMetadata(fileId: string): Promise<Models.Document> {
    return await this.databases.getDocument("main", "metadata", fileId);
  }
}

export const appwriteService = new AppwriteService();
