import React from 'react'
import ReactDOM from 'react-dom'
import fileSaver from 'file-saver'
import './index.scss'

const HOST = 'http://127.0.0.1:3000/decode'

const App = () => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    event.nativeEvent.preventDefault()
    const target = Array.from(event.nativeEvent.target)
    const file: File = target[0]?.files[0]
    if (!file) {
      alert('Please upload a file!')
      return
    }
    fetch(HOST, {
      method: 'post',
      mode: 'cors',
      body: new FormData(event.nativeEvent.target),
    })
      .then((res) => {
        if (res.status == 200) return res.blob()
        alert('Error decode')
      })
      .then((body) => fileSaver.saveAs(body, file.name.replace('.silk', '.mp3')))
      .catch((error) => alert(error.message))
  }

  return (
    <section className="silk-decoder">
      <h1>Silk Decoder Online</h1>
      <form onSubmit={handleSubmit} encType="multipart/form-data" method="post">
        <input type="file" name="file" multiple />
        <input type="submit" value="Upload" />
      </form>
    </section>
  )
}

ReactDOM.render(<App />, document.querySelector('#app'))
