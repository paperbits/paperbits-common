/**
 * Returns closest element that satisfies the predicate.
 * @param node {Node} Node from which the search starts.
 * @param predicate {(node: Node) => boolean} Search predicate
 */
export function closest(node: Node, predicate: (node: Node) => boolean): Node {
    do {
        if (predicate(node)) {
            return node;
        }

        node = node.parentNode;
    }
    while (node);
}