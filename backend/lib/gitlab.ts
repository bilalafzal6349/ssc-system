// lib / gitlab.ts;
import { Gitlab } from "@gitbeaker/node";

interface MergeRequest {
  id: number;
}

const gitlab = new Gitlab({
  host: process.env.GITLAB_HOST,
  token: process.env.GITLAB_TOKEN,
});

export async function submitMergeRequest(
  repositoryId: string,
  code: string,
  description: string,
  userId: string
): Promise<MergeRequest> {
  try {
    const branchName = `user-${userId}-branch`;
    await gitlab.Branches.create(repositoryId, branchName, "main");
    await gitlab.Commits.create(repositoryId, branchName, "Add contribution", [
      { action: "create", filePath: "contribution.txt", content: code },
    ]);
    const mergeRequest = await gitlab.MergeRequests.create(
      repositoryId,
      branchName,
      "main",
      description
    );
    return mergeRequest;
  } catch (error) {
    throw new Error(`GitLab error: ${(error as Error).message}`);
  }
}
