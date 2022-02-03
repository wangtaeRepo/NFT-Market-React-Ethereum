import React, { useState, useContext } from 'react'

// css
import styled from 'styled-components'
import { InnerLayout } from '../Layouts'
import CtaButton from './CtaButton'
import FolderIcon from '../assets/folder_icon_transparent.png'
import CloseIcon from '../assets/CloseIcon.svg'

// imageUpload Buffer
import { Buffer } from 'buffer'

// Metamask 데이터 가져오기
import Web3Context from '../store/web3-context'

// Contract 데이터 가져오기
import CollectionContext from '../store/collection-context'

//IPFS 설정
const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient.create({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
})

const MintForm = () => {
  const web3Ctx = useContext(Web3Context)
  const collectionCtx = useContext(CollectionContext)

  const [enteredDescription, setEnteredDescription] = useState('')
  const [nameIsValid, setNameIsValid] = useState(true)

  const [enteredName, setEnteredName] = useState('')
  const [descriptionIsValid, setDescriptionIsValid] = useState(true)

  const [enteredPrice, setEnteredPrice] = useState('')
  const [priceIsValid, setPriceIsValid] = useState(true)

  const [capturedFileBuffer, setCapturedFileBuffer] = useState(null)
  const [fileIsValid, setFileIsValid] = useState(true)

  const [image, setImage] = useState('')
  const [isUploaded, setIsUploaded] = useState(false)
  const [typeFile, setTypeFile] = useState('')

  // Image Upload 관련 코드 - 중복되는 코드 있을거같은데.. 최적화 필요
  const handleImageChange = (e) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setTypeFile(e.target.files[0].type)
      const reader = new window.FileReader()
      reader.readAsArrayBuffer(file)
      reader.onloadend = () => {
        console.log(reader.result)
        setCapturedFileBuffer(Buffer(reader.result))
      }

      let reader2 = new FileReader()
      reader2.onload = function (e) {
        setImage(e.target.result)
        setIsUploaded(true)
      }
      reader2.readAsDataURL(e.target.files[0])
    }
  }

  // MetaData Upload && Mint NFT
  const submissionHandler = (event) => {
    event.preventDefault()

    enteredName ? setNameIsValid(true) : setNameIsValid(false)
    enteredDescription
      ? setDescriptionIsValid(true)
      : setDescriptionIsValid(false)
    enteredPrice ? setPriceIsValid(true) : setPriceIsValid(false)
    capturedFileBuffer ? setFileIsValid(true) : setFileIsValid(false)

    const formIsValid =
      enteredName && enteredDescription && enteredPrice && capturedFileBuffer

    // Upload file to IPFS and push to the blockchain
    const mintNFT = async () => {
      // 모든 항목을 넣고 mint 버튼을 누르면 비동기적으로 수행되는 로직
      console.log('mintNFT')
      // Add imageFile to the IPFS
      const fileAdded = await ipfs.add(capturedFileBuffer)
      console.log('fileHash : ' + fileAdded.path)
      if (!fileAdded) {
        console.error('Something went wrong when updloading the file')
        return
      }

      // matadata 정의
      const metadata = {
        title: 'Asset Metadata',
        type: 'object',
        properties: {
          name: {
            type: 'string',
            description: enteredName,
          },
          description: {
            type: 'string',
            description: enteredDescription,
          },
          image: {
            type: 'string',
            description: fileAdded.path,
          },
          price: {
            type: 'string',
            description: enteredPrice,
          },
        },
      }

      // Add MetaData to the IPFS
      const metadataAdded = await ipfs.add(JSON.stringify(metadata))
      if (!metadataAdded) {
        console.error('Something went wrong when updloading the file')
        return
      }
      console.log('metadataAdded : ' + metadataAdded.path)

      try {
        const contractWithSigner = collectionCtx.contractWithSigner
        let result = await contractWithSigner.safeMint(
          web3Ctx.account,
          metadataAdded.path,
        )
        console.log('mint hash : ', result.hash)
      } catch (e) {
        console.log(e instanceof TypeError) // true
        console.log(e.message) // "null has no properties"
        console.log(e.name) // "TypeError"
        console.log(e.fileName) // "Scratchpad/1"
        console.log(e.lineNumber) // 2
        console.log(e.columnNumber) // 2
        console.log(e.stack) // "@Scratchpad/2:2:3\n"
      }
    }

    console.log(formIsValid)
    formIsValid && mintNFT()
  }

  const nameClass = nameIsValid ? 'form-control' : 'form-control is-invalid'
  const descriptionClass = descriptionIsValid
    ? 'form-control'
    : 'form-control is-invalid'
  const priceClass = priceIsValid ? 'form-control' : 'form-control is-invalid'
  const fileClass = fileIsValid ? 'form-control' : 'form-control is-invalid'

  return (
    <MintFormStyled>
      <InnerLayout>
        <div className="Minter">
          <br></br>
          <h1 className="GradientText">Mint Your NFT</h1>
          <p>um................</p>
          <h3>Link to asset: </h3>
          <BoxUpload>
            <div className="image-upload">
              {!isUploaded ? (
                <>
                  <label htmlFor="upload-input">
                    <img
                      src={FolderIcon}
                      draggable={'false'}
                      alt="placeholder"
                      style={{ width: 100, height: 100 }}
                    />
                    <p>Click to upload image</p>
                  </label>

                  <input
                    id="upload-input"
                    type="file"
                    accept=".jpg,.jpeg,.gif,.png,.mov,.mp4"
                    className={`${fileClass} mb-1`}
                    onChange={handleImageChange}
                  />
                </>
              ) : (
                <ImagePreview>
                  <img
                    className="close-icon"
                    src={CloseIcon}
                    alt="CloseIcon"
                    onClick={() => {
                      setIsUploaded(false)
                      setImage(null)
                    }}
                  />
                  {typeFile.includes('video') ? (
                    <video
                      id="uploaded-image"
                      src={image}
                      draggable={false}
                      controls
                      autoPlay
                      alt="uploaded-img"
                    />
                  ) : (
                    <img
                      id="uploaded-image"
                      src={image}
                      draggable={false}
                      alt="uploaded-img"
                    />
                  )}
                </ImagePreview>
              )}
            </div>
          </BoxUpload>
          <form>
            <h3>Name: </h3>
            <FormInput
              type="text"
              className={`${nameClass} mb-1`}
              placeholder="Name"
              value={enteredName}
              onChange={(event) => setEnteredName(event.target.value)}
            />
            <h3>Description: </h3>
            <FormInput
              type="text"
              className={`${descriptionClass} mb-1`}
              placeholder="Description"
              value={enteredDescription}
              onChange={(event) => setEnteredDescription(event.target.value)}
            />
            <h3>Price: </h3>
            <FormInput
              type="text"
              className={`${priceClass} mb-1`}
              placeholder="Price"
              value={enteredPrice}
              onChange={(event) => setEnteredPrice(event.target.value)}
            />
            <div className="btns-con" onClick={submissionHandler}>
              <CtaButton name={'Mint NFT'} />
            </div>
          </form>
        </div>
      </InnerLayout>
    </MintFormStyled>
  )
}
const MintFormStyled = styled.div`
  height: 100%;
  width: 100%;
  display: grid;
  place-items: center;
  .btns-con {
    width: 100%;
    a {
      margin: 0.6rem 0;
      display: inline-block;
      width: 100%;
      text-align: center;
    }
  }
`

const FormInput = styled.input`
  display: block;
  padding-left: 10px;
  outline: none;
  border-radius: 2px;
  height: 40px;
  width: 100%;
  border: none;
  //   border-bottom: 1px solid #cfcfcf;
  font-size: 1rem;
  // background-color: transparent;
  // font-color: white;
  margin-bottom: 15px;
  margin-top: 10px;
`

const BoxUpload = styled.div`
  display: grid;
  margin-top: 20px;
  place-items: center;
  margin-bottom: 10px;
  border: 1px dashed #799cd9;
  /* padding: 36px 48px; */
  position: relative;
  height: 350px;
  width: 350px;
  //   background: #88a2d8;
  border-radius: 20px;
  .image-upload {
    display: flex;
    flex-wrap: wrap;
    text-align: center;
    label {
      cursor: pointer;

      :hover {
        opacity: 0.8;
      }
    }
    > input {
      display: none;
    }
  }
`

const ImagePreview = styled.div`
  position: relative;
  /* cursor: pointer; */
  #uploaded-image {
    height: 350px;
    width: 350px;
    object-fit: cover;
    border-radius: 20px;
  }
  .close-icon {
    background: #000;
    border-radius: 5px;
    opacity: 0.8;
    position: absolute;
    z-index: 10;
    right: 15px;
    top: 20px;
    cursor: pointer;
    :hover {
      opacity: 1;
    }
  }
`

export default MintForm
