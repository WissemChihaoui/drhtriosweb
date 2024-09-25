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
                link:"create.presence"
            },
            {
                label: "Voir la présence",
                link:"presence"
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
                link:"questionnaire"
            },
            {
                label: "Liste des sanctions",
                link:"sanctions"
            },
        ],
        icon:"zoom-question"
    },
    {
        label: "Polyvalence",
        link:"polyvalence",
        children:null,
        icon:"user-star"
    },
    {
        label: "Liste des machines",
        link:"machines",
        children:null,
        icon:"building-warehouse"
    },
    {
        label: "Paramétres",
        link:"#",
        children:[
            {
                label: "Catégories",
                link:"categories"
            },
            {
                label: "Contract",
                link:"contracts"
            },
            {
                label: "Type des congés",
                link:"conges"
            },
        ],
        icon:"settings-2"
    },
]