import { connect } from 'react-redux'
import { 
  setMessageBody,

  removeAllEmbeds,
  setEmbed,

  addField,
  setField
} from 'constants/actions'
import CodeMirror from './codemirror'

const filterState = (state) => {
  const editorState = {}
  Object.keys(state).forEach((key)=>{
    let value = state[key]
    const notEmptyString = (val) => (typeof val === "string")&&(val.length > 0)
    let notEmptyArray = Array.isArray(value)&&(value.length>0)

    if (notEmptyString(value) || notEmptyArray ) editorState[key] = value
    else if (typeof value === "object" && !(notEmptyArray)) {
      for (var prop in value) {
        if (notEmptyString(value[prop])) {
          if (!(key in editorState)) editorState[key] = {}
          editorState[key][prop] = value[prop]
        }
      }
    }
    else if (typeof value === "number")
    {
      editorState[key] = value;
    }
  })

  return editorState
}

const mapState = (state) => {
  const mappedState = {
    content: state.messageBody,
    embeds: state.embeds.map(embed => ({
      title: embed.title,
      url: embed.url,
      description: embed.description,
      author: {...embed.author},
      color: embed.color,
      footer: {...embed.footer},
      thumbnail: embed.thumbnail,
      image: embed.image,
      fields: embed.fields
    }))
  }

  return mappedState
}

export const mapStateToProps = (state) => {
  state = mapState(state);
  state = {
    ...state,
    embeds: state.embeds.map(e => filterState(e))
  }
  return {
    value: JSON.stringify(filterState(state), null, '  ')
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onChange: (fromJSON, change) => {
      const defaultObject = {
        content: '',
        embeds: [{
          title: '',
          url: '',
          description: '',
          author: {
            name: '',
            url: '',
            icon_url: '',          
          },
          color: 0,
          footer: {
            text: '',
            icon_url: ''
          },
          thumbnail: '',
          image: '',
          fields: []
        }]
      }

      for (var prop in fromJSON) {
        if ((prop in defaultObject)&&(!Array.isArray(defaultObject[prop]))&&(typeof defaultObject[prop] === 'object')) {
          Object.assign(defaultObject[prop], fromJSON[prop])
        }
      }
      const lump = Object.assign(defaultObject, fromJSON) 

      dispatch(setMessageBody(lump.content));
      dispatch(removeAllEmbeds())
      lump.embeds.forEach((e, index) => {
        // dispatch(addEmbed());
        dispatch(setEmbed(index, e))
        // dispatch(setDescription(index, e.description))
        // dispatch(setAuthor(index, {...e.author}))
        // dispatch(setTitle(index, {title: e.title, url: e.url}))
        // dispatch(setFooter(index, {...e.footer})) 
        // dispatch(setColor(index, integerToColor(e.color)))
        // dispatch(setImage(index, e.image))
        // dispatch(setThumbnail(index, e.thumbnail))
        if(typeof e.fields !== 'undefined')
          e.fields.forEach((f,i) => {
            dispatch(addField())
            dispatch(setField(index, f, i))
          })
      })
    },
  }
}

const CodeMirrorContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(CodeMirror)

export default CodeMirrorContainer