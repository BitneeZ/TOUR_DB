import json
import numpy as np
from collections import defaultdict

def process_dataset():
    # Sample data processing with more statistical information
    data = {
        "labels": ["January", "February", "March", "April", "May"],
        "values": [65, 59, 80, 81, 56],
        "categories": ["A", "B", "A", "C", "B"]
    }
    
    # Calculate additional statistics
    values = np.array(data["values"])
    categories = data["categories"]
    
    # Category-wise statistics
    category_stats = defaultdict(list)
    for val, cat in zip(values, categories):
        category_stats[cat].append(val)
    
    data["statistics"] = {
        "mean": float(np.mean(values)),
        "median": float(np.median(values)),
        "std": float(np.std(values)),
        "min": float(np.min(values)),
        "max": float(np.max(values)),
        "category_means": {
            cat: float(np.mean(vals)) 
            for cat, vals in category_stats.items()
        }
    }
    
    # Save to JSON file that will be read by the dashboard
    with open('data.json', 'w') as f:
        json.dump(data, f)

if __name__ == "__main__":
    process_dataset()