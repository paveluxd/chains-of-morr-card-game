const { Clietn, Client } = require('@notionhq/client')

const notion = new Client({ auth: process.env.NOTION_API_KEY})

//Gets info from DB
async function getDatabase(){

    //Get info of the database
    const response = await notion.databases.retrieve({ database_id: process.env.NOTION_DATABASE_ID})
    console.log(response.properties.Title)
}

getDatabase()

//ADDS a row to database
function createSuggestion({title, description}){
    notion.pages.create({
        //select db
        parent:{
            database_id: process.env.NOTION_DATABASE_ID
        },

        //define what to add
        //add content to title colum
        //use notion page-property-value page to see how to add variosus column data
        properties: {
            [process.env.NOTION_TITLE_ID]:{
                title: [
                    {
                        type: 'text',
                        text: {
                            content: title
                        }
                    }
                ]
            },
            //Add content to description column
            [process.env.NOTION_DESCRIPTION_ID]:{
                rich_text: [
                    {
                        type: 'text',
                        text: {
                            content: description
                        }
                    }
                ]
            }
        }
    })
}

//Get tags of the column
async function getTags(){
    const database = await notion.databases.retrieve({ database_id: process.env.NOTION_DATABASE_ID})
    //.Tags -> column name
    return notionPropertiesById(database.properties)[process.env.NOTION_TAGS_ID]
    // map removes colour property
        .multi_select.options.map(option => {
            return {id: option.id, name: option.name }
        })
}

// Pulls out tag ids and stores everything else in the ...rest var
// Sets ids as keys
function notionPropertiesById(properties){
    return Object.values(properties).reduce((obj, property) => {
        const {id, ...rest} = property
        return {...obj, [id]:rest}
    }, {})
}

// getTags().then(res => console.log(res))

// createSuggestion({ title:'test', description:'fml' })

//NOTION_VOTES_ID = ~CyT - column id in .env file