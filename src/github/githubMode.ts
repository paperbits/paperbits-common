export class GithubMode {
    static file = "100644"; //blob
    static executable = "100755"; //blob
    static subdirectory = "040000"; //tree
    static submodule = "160000"; //commit
    static pathOfSymlink = "120000"; //blob
}