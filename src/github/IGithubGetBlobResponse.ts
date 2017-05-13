export interface IGithubGetBlobResponse {
    sha: string;
    content: string;
    encoding: string;
    size: number;
}