import { Url } from "../models/url.js";
import {nanoid} from "nanoid"
import {ApiError}from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import mongoose from "mongoose";

const createShortUrl = async(req,res)=>{
    const {originalUrl,customAlias} = req.body

    if(!originalUrl) throw new ApiError(400,"Url required")

    let shortUrl = customAlias ? customAlias.trim().toLowerCase() : nanoid(6);

    // const shortUrl = nanoid(6);
    const newUrl = await Url.create({
        originalUrl,
        shortUrl
    })

    if(!newUrl) throw new ApiError(404,"custom alias already exist")
    
    return res
    .status(201)
    .json(
        new ApiResponse(
            201,
            newUrl,
            // `http://localhost:8000/${shortUrl}`,
            "Shorturl created successfully"
        )
    )
}

const redirectUrl = async(req,res)=>{
    const {shortUrl} = req.params;

    if(!shortUrl) throw new ApiError(400,"Invalid shorturl")

    const url = await Url.findOneAndUpdate(
        {shortUrl:shortUrl},
        {$inc:{clicks:1}},
        // {new:true}
    )

    if(!url) throw new ApiError(404,"short url not found")

    res.redirect(url.originalUrl);
    
    // return res
    // .status(200)
    // .json(
    //     new ApiResponse(
    //         200,
    //         url,
    //         "Successfully redirect to the url"
    //     )
    // )
}

const getalllinks= async(req,res)=>{
    const links = await Url.find().sort({createdAt:-1});
    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            links,
            "Links fetched successfully"
        )
    )
}

const getstats = async(req,res) =>{
    const stats = await Url.aggregate([
        {
            $group:{
                _id:null,
                totalLinks: { $sum: 1 },
                totalClicks:{
                    $sum:"$clicks"
                }
            }
        }
    ])

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {
                totalLinks:stats[0]?.totalLinks || 0,
                totalClicks:stats[0]?.totalClicks || 0,
            }
        )
    )
}

const deleteLink = async(req,res)=>{
    const {id} = req.params
    if(!mongoose.Types.ObjectId.isValid(id)) throw new ApiError(400,"Invalid id")
    const deleted = await Url.findByIdAndDelete(id);
    if(!deleted) throw new ApiError(404,"Link not found")

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {},
            "Link deleted successfully"
        )
    )
}

export {createShortUrl,redirectUrl,getalllinks,getstats,deleteLink}