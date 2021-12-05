import React, {useEffect, useState} from 'react';
import {useFormContext} from "react-hook-form";
import {useDropzone} from "react-dropzone";
import Button from "./Button";

const FileDropzone = (props) => {
        const {name, accept} = props
        const {register, unregister, setValue, watch} = useFormContext();
        const [filePreview, setFilePreview] = useState("")

        useEffect(() => {
            register(name, {required: true});
            return () => {
                unregister(name);
            };
        }, []);

        const file = watch(name);

        const {getRootProps, getInputProps} = useDropzone({
            maxFiles: 1,
            accept: accept,
            onDrop: acceptedFiles => {
                const firstFile = acceptedFiles[0]
                if (firstFile) {
                    setValue(name, firstFile, {shouldValidate: true});
                    setFilePreview(URL.createObjectURL(firstFile))
                    // uploadBytes(storageRef, file).then((snapshot) => {
                    //     console.log(snapshot.ref.fullPath)
                    //     console.log('Uploaded a blob or file!');
                    // });
                }
            }
        })

        function clearPreview() {
            console.log("CLEARING PREVIEW")
        }

        return (
            <>
                {file ?
                    <>
                        <Button onClick={clearPreview}>Save</Button>
                        <img src={filePreview} alt="id image preview"/>
                    </>

                     :
                    <></>}
                <div {...getRootProps({className: "mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md"})} >
                    <div className="space-y-1 text-center">
                        <svg
                            className="mx-auto h-12 w-12 text-gray-400"
                            stroke="currentColor"
                            fill="none"
                            viewBox="0 0 48 48"
                            aria-hidden="true"
                        >
                            <path
                                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                        <div className="flex text-sm text-gray-600">
                            <label
                                htmlFor="file-upload"
                                className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                            >
                                <span>Upload a file</span>
                                <input id={name} name={name}
                                       type="file" className="sr-only" {...getInputProps()} />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                    </div>
                </div>
            </>

        );
    }
;

export default FileDropzone