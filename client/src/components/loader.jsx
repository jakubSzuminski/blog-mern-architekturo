import { Triangle } from 'react-loader-spinner';

const Loader = ({ h, w }) => {
    return (
        <Triangle
            height={`${h}`}
            width={`${w}`}
            color="#423122"
            ariaLabel="triangle-loading"
            wrapperStyle={{display: 'flex', justifyContent: 'center'}}
            wrapperClassName=""
            visible={true}
        />
    )
}

export default Loader;