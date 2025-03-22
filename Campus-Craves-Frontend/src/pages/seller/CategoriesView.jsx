import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CategoriesView.css';

const CategoriesView = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState({
    
    'Snacks Veg': [],
    'Snacks Non-veg': [],
    'Main Course Veg': [],
    'Main Course Non-Veg': [],
    'Desserts': [],
    'Beverages': [], // Added Beverages
    'Packed Food': []
  });

  const [newCategory, setNewCategory] = useState({
    title: '',
    type: 'Snacks Veg',
    description: '',
    price: ''
  });

  const [visibleCategory, setVisibleCategory] = useState(null); // State to track visible category

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCategory({ ...newCategory, [name]: value });
  };

  const addCategory = () => {
    setCategories({
      ...categories,
      [newCategory.type]: [...categories[newCategory.type], newCategory]
    });
    setNewCategory({ title: '', type: 'Snacks Veg', description: '', price: '' });
  };

  const [editableCategory, setEditableCategory] = useState(null);

  const handleEditChange = (type, index, field, value) => {
    const updatedCategories = { ...categories };
    updatedCategories[type][index][field] = value;
    setCategories(updatedCategories);
  };

  const toggleCategoryVisibility = (type) => {
    setVisibleCategory(visibleCategory === type ? null : type);
  };

  return (
    <div className="categories-view-container">
      <div className="top-bar">
        <h1 className="website-name" onClick={() => navigate("/")}>CampusCrave</h1>
        <div className="nav-buttons">
          <button onClick={() => navigate("/ordersview")} className="nav-button">Orders</button>
          <button onClick={() => navigate("/menu")} className="nav-button">Menu</button>
        </div>
      </div>
      <div className="categories-content">

        <div className="existing-categories-section">
          <h2>Existing Categories</h2>
          <div className="category-type-container"> {/* Add a container for category type buttons */}
            {Object.keys(categories).map((type) => (
              <div key={type} className="category-type">
                <button
                  className={`category-type-button ${type.replace(/\s+/g, '-')}`}
                  onClick={() => toggleCategoryVisibility(type)}
                >
                  {type}
                </button>
                {visibleCategory === type && (
                  <div className="category-list">
                    {categories[type].map((category, index) => (
                      <div key={index} className="category-item">
                        <h3>{category.title}</h3>
                        {editableCategory === `${type}-${index}` ? (
                          <>
                            <input
                              type="text"
                              value={category.description}
                              onChange={(e) => handleEditChange(type, index, 'description', e.target.value)}
                            />
                            <input
                              type="text"
                              value={category.price}
                              onChange={(e) => handleEditChange(type, index, 'price', e.target.value)}
                            />
                          </>
                        ) : (
                          <>
                            <p>{category.description}</p>
                            <p><strong>Rs. {category.price}</strong></p> {/* Make price bold */}
                          </>
                        )}
                        <button
                          onClick={() =>
                            setEditableCategory(editableCategory === `${type}-${index}` ? null : `${type}-${index}`)
                          }
                          className="edit-category-button"
                        >
                          {editableCategory === `${type}-${index}` ? 'Save' : 'Edit'}
                        </button>
                        <button
                          onClick={() => {
                            const updatedCategories = { ...categories };
                            updatedCategories[type].splice(index, 1);
                            setCategories(updatedCategories);
                          }}
                          className="delete-category-button"
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="new-category-section">
          <h2>Create New Category</h2>
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={newCategory.title}
            onChange={handleInputChange}
          />
          <select name="type" value={newCategory.type} onChange={handleInputChange}>
            <option value="Snacks Veg">Snacks Veg</option>
            <option value="Snacks Non-veg">Snacks Non-veg</option>
            <option value="Main Course Veg">Main Course Veg</option>
            <option value="Main Course Non-Veg">Main Course Non-Veg</option>
            <option value="Deserts">Deserts</option>
            <option value="Beverages">Beverages</option> {/* Added Beverages */}
          </select>
          <input
            type="text"
            name="description"
            placeholder="Description"
            value={newCategory.description}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="price"
            placeholder="Price"
            value={newCategory.price}
            onChange={handleInputChange}
          />
          <button onClick={addCategory} className="add-category-button">Add Category</button>
        </div>
        
      </div>
    </div>
  );
};

export default CategoriesView;