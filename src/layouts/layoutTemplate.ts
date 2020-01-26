export const layoutTemplate = {
    type: "layout",
    nodes: [
        {
            type: "layout-section",
            styles: null,
            nodes: [
                {
                    type: "grid",
                    nodes: [
                        {
                            type: "grid-cell",
                            nodes: [
                                {
                                    type: "page"
                                }
                            ],
                            role: "article",
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
                                                vertical: "center",
                                                horizontal: "center"
                                            }
                                        }
                                    },
                                    "id": "myaxhjsvdw",
                                    "padding": {
                                        xs: {
                                            top: 5,
                                            left: 5,
                                            right: 5,
                                            bottom: 5
                                        },
                                        md: {
                                            top: 15,
                                            left: 15,
                                            right: 15,
                                            bottom: 15
                                        }
                                    }
                                }
                            }
                        }
                    ],
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
                            id: "cmwjhkfdnp",
                            size: {
                                sm: {
                                    maxWidth: 540
                                },
                                md: {
                                    maxWidth: 720
                                },
                                lg: {
                                    maxWidth: 960
                                },
                                xl: {
                                    maxWidth: 1140
                                }
                            },
                            margin: {
                                xs: {
                                    top: 10,
                                    left: "auto",
                                    right: "auto",
                                    bottom: 10
                                },
                                md: {
                                    top: 15,
                                    bottom: 15
                                },
                                xl: {
                                    top: 25,
                                    bottom: 25
                                }
                            }
                        }
                    }
                }
            ]
        }
    ]
};