import React, { useState, useRef } from 'react'
import ReactDOM from 'react-dom'
import fileSaver from 'file-saver'
import './index.scss'

const HOST = 'https://emmmm.dev/aliyunCGI/silk-decoder/decode'

const App = () => {
  const fileUploadRef = useRef(null)
  const formRef = useRef(null)

  const [dragging, setDragging] = useState(false)
  const [selectType, setSelectType] = useState('mp3')

  const handleSubmit = (_file?: File) => {
    const form = formRef.current
    const fileUpload = fileUploadRef.current
    const file: File = _file || fileUpload?.files[0]
    if (!file) {
      alert('Please upload a file!')
      return
    }
    const formData = new FormData(form)
    formData.set('file', file)
    formData.set('format', selectType)

    fetch(HOST, {
      method: 'post',
      mode: 'cors',
      body: formData,
    })
      .then((res) => {
        if (res.status == 200) return res.blob()
        throw new Error(res.statusText)
      })
      .then((body) => fileSaver.saveAs(body, file.name?.replace('.silk', '.mp3')))
      .catch((error) => alert(error.message || 'Error while decode'))
  }

  const handleDragOver = (event) => {
    event.preventDefault()
    setDragging(true)
    event.dataTransfer.dropEffect = 'move'
  }

  const handleDragLeave = (event) => {
    event.preventDefault()
    setDragging(false)
  }

  const handleDrop = (event) => {
    event.preventDefault()
    setDragging(false)
    const dataTransfer = event.dataTransfer
    const files = dataTransfer.files
    handleSubmit(files[0])
  }

  return (
    <article className="silk-decoder">
      <h1>SILK DECODER ONLINE</h1>
      <form ref={formRef} encType="multipart/form-data" method="post">
        <section
          className={`silk-decoder-upload ${dragging ? 'silk-decoder-upload--dragging' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileUploadRef.current?.click()}
        >
          <figcaption className="silk-decoder-upload__icon">
            <svg
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="4412"
              width="40"
              height="40"
            >
              <path
                d="M883.6 926.7H140.4c-42.1 0-76.4-35.9-76.4-80V577.8c0-22.1 17.9-40 40-40s40 17.9 40 40v268.9h736V577.8c0-22.1 17.9-40 40-40s40 17.9 40 40v268.9c0 44.1-34.3 80-76.4 80z"
                fill="#bfbfbf"
                p-id="4413"
              ></path>
              <path
                d="M512 744.2c-22.1 0-40-17.9-40-40V104.6c0-22.1 17.9-40 40-40s40 17.9 40 40v599.6c0 22.1-17.9 40-40 40z"
                fill="#bfbfbf"
                p-id="4414"
              ></path>
              <path
                d="M320 335.9c-10.2 0-20.5-3.9-28.3-11.7-15.6-15.6-15.6-40.9 0-56.6L481.6 77.8c4.5-4.5 13.9-13.9 30.4-13.9 10.6 0 20.8 4.2 28.3 11.7l192 192c15.6 15.6 15.6 40.9 0 56.6s-40.9 15.6-56.6 0L512 160.5 348.3 324.2c-7.8 7.8-18.1 11.7-28.3 11.7z"
                fill="#bfbfbf"
                p-id="4415"
              ></path>
            </svg>
          </figcaption>
          <h4>Drop your .silk files here!</h4>
          <p>Max 5 MB file.</p>
          <input ref={fileUploadRef} onChange={() => handleSubmit()} type="file" name="file" accept=".silk" />
        </section>
        <p className="silk-decoder-upload__type">
          <label htmlFor="select">
            Output file type:
            <select id="select" value={selectType} onChange={(event) => setSelectType(event.target.value)}>
              <option value="mp3">MP3</option>
              <option value="wav">WAV</option>
              <option value="ogg">Ogg</option>
            </select>
          </label>
        </p>
      </form>
      <section className="silk-decoder-about">
        <p className="silk-decoder-logo">
          <img width={80} src={require('./logo.png')} alt="silk decoder" />
        </p>
        <p>
          <a href="https://opensource.org/licenses/MIT" style={{ marginRight: '0.5rem' }}>
            <img src="https://img.shields.io/badge/License-MIT-brightgreen.svg" alt="" />
          </a>
          <a
            className="github-button"
            href="https://github.com/chen86860/silk-decoder-online"
            data-show-count="true"
            target="_blank"
            aria-label="Star chen86860/silk-decoder-online on GitHub"
          >
            Star
          </a>
        </p>
        <h2>About</h2>
        <p>
          Decode silk v3 audio file to usually format like <a href="https://en.wikipedia.org/wiki/MP3">MP3</a>,
          <a href="https://en.wikipedia.org/wiki/WAV">WAV</a>, <a href="https://en.wikipedia.org/wiki/Ogg">Ogg</a>.
          Powered by <a href="https://github.com/kn007/silk-v3-decoder">silk-v3-decoder</a>.
        </p>
      </section>
    </article>
  )
}

ReactDOM.render(<App />, document.querySelector('#app'))
