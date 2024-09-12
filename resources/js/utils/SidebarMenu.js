export const Menu = [
    {
        label: "Tableau de bord",
        link:"dashboard",
        children:null,
        icon:"dashboard"
    },
    {
        label: "Liste des employées",
        link: "workers",
        icon:"users",
        children:null
    },
    {
        label: "Présence",
        link: "#",
        icon:"users",
        children:[
            {
                label: "Marque la présence",
                link:"dashboard"
            },
            {
                label: "Voir la présence",
                link:"dashboard"
            },
            {
                label: "Type des congés",
                link:"dashboard"
            },
        ]
    },
    {
        label: "Les absents",
        link:"dashboard",
        children:null,
        icon:"user-cancel"
    },
    {
        label: "Absentiesme",
        link:"dashboard",
        children:null,
        icon:"user-question"
    },
    {
        label: "Département",
        link:"departements",
        children:null,
        icon:"building"
    },
    {
        label: "Questionnaire",
        link:"#",
        children:[
            {
                label: "Liste des questionnaire",
                link:"dashboard"
            },
            {
                label: "Liste des sanctions",
                link:"dashboard"
            },
        ],
        icon:"zoom-question"
    },
    {
        label: "Polyvalence",
        link:"dashboard",
        children:null,
        icon:"user-star"
    },
    {
        label: "Liste des machines",
        link:"dashboard",
        children:null,
        icon:"building-warehouse"
    },
    {
        label: "Dépenses",
        link:"dashboard",
        children:null,
        icon:"moneybag"
    },
]