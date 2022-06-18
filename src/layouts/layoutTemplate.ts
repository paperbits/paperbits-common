export const layoutTemplate = {
    type: "layout",
    nodes: [{
        type: "layout-section",
        styles: null,
        nodes: [{
            type: "grid",
            nodes: [{
                type: "grid-cell",
                nodes: [{
                    type: "page"
                }],
                role: "main",
                styles: {
                    instance: {
                        "grid-cell": {
                            xs: {
                                position: {
                                    col: 1,
                                    row: 1
                                },
                                span: {
                                    cols: 1,
                                    rows: 1
                                },
                                alignment: {
                                    vertical: "top",
                                    horizontal: "center"
                                }
                            }
                        },
                        "padding": {
                            xs: {
                                top: 5,
                                left: 5,
                                right: 5,
                                bottom: 5
                            }
                        }
                    }
                }
            }],
            styles: {
                instance: {
                    grid: {
                        xs: {
                            rows: [
                                "auto"
                            ],
                            cols: [
                                "1fr"
                            ]
                        }
                    },
                    size: {
                        lg: {
                            maxWidth: 1140
                        }
                    },
                    margin: {
                        xs: {
                            left: "auto",
                            right: "auto"
                        }
                    }
                }
            }
        }]
    }]
};