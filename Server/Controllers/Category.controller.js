
import Category from '../Models/Category.js'

export const getAllCategory=async (req, res)=>{
    try{
         const categories = await Category.find({});
         res.status(200).json(categories)
    }
    catch(err){
        res.status(500).json({error: err.message})
        }
}

export const getCategoryById=async(req,res)=>{
    try{
        const id=req.params.id;
        const category = await Category.findById(id)
        
        if (!category) 
            return res.status(404).json({ message: 'Category not found' })
        
        res.status(200).json(category)
    }
    catch(err){
        res.status(500).json({error: err.message})
    }
}

export const addCategory=async(req, res)=>
{
    const {name}=req.body;
    try
    {
        if(!name) {
            return res.status(400).json({ message: "Name is required" })
        }
        
        const newCategory=new Category({ name })
        await newCategory.save()
        res.status(201).json({ message: "Category added successfully", category: newCategory})
    }
    catch(err)
    {
        res.status(500).json({error: err.message})
    };
}

export const UpdateCategory=async(req,res)=>{
    try{
        let update=await Category.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new:true,runValidators: true}
        );
        if(!update)
            return res.status(404).json({message:"Category not found"})
        
        return res.status(200).json({message: "Category updated successfully", category: update})
    }
    catch(err){
        res.status(500).json({error: err.message})
    };
}

export const deleteCategory=async(req, res)=>
{
    try
    {
        const deleted = await Category.findByIdAndDelete(req.params.id)
        
        if(!deleted)
            return res.status(404).json({message: "Category not found"})
            
        res.status(200).json({message: "Category deleted successfully", category: deleted})
    }
    catch(err)
    {
        res.status(500).json({error: err.message})
    };
}
