import appleTouchIcon from '../assets/favicon/apple-touch-icon.png'
import favicon32 from '../assets/favicon/favicon-32x32.png'
import favicon16 from '../assets/favicon/favicon-16x16.png'
import webManifest from '../assets/favicon/site.webmanifest?url'
import faviconIco from '../assets/favicon/favicon.ico'

const PayMeBackHead = () => {
    return (
        <>
            <title>Pay Me Back</title>
            <link rel="apple-touch-icon" sizes="180x180" href={appleTouchIcon} />
            <link rel="icon" type="image/png" sizes="32x32" href={favicon32} />
            <link rel="icon" type="image/png" sizes="16x16" href={favicon16} />
            <link rel="manifest" href={webManifest} />
            <link rel="shortcut icon" href={faviconIco} />
        </>
    )
}

export default PayMeBackHead